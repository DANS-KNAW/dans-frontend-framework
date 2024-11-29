import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { setField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type {
  OptionsType,
  ExtendedMapFeature,
  CoordinateSystem,
  DrawMapFieldType,
} from "../../../types/MetadataFields";
import type { DrawMapFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import GLMap, {
  ScaleControl,
  NavigationControl,
  useControl,
  Source,
  Layer,
  useMap,
  type LngLatBoundsLike,
  type MapRef,
} from "react-map-gl/maplibre";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./Map.css";
import type { Point, Polygon, LineString } from "geojson";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PolylineIcon from "@mui/icons-material/Polyline";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import PentagonIcon from "@mui/icons-material/Pentagon";
import {
  useFetchGeonamesFreeTextQuery,
  useFetchPlaceReverseLookupQuery,
} from "../api/geonames";
import {
  useFetchCoordinateSystemsQuery,
  useLazyTransformCoordinatesQuery,
} from "../api/maptiler";
import {
  useFetchCapabilitiesQuery,
  useLazyFetchFeatureQuery,
} from "../api/wms";
import type { QueryReturnType } from "../../../types/Api";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import Collapse from "@mui/material/Collapse";
import PublicIcon from "@mui/icons-material/Public";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

/**
 * Map field
 * Lookup base location/point via Geonames.
 * Allows user to edit selected point from Geonames location, or draw a line, square, polygon, circle.
 * Gets saved as GeoJSON.
 * Also allows user to select Geobasis standard.
 */

const DrawMap = ({ field, sectionIndex }: DrawMapFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const [geonamesValue, setGeonamesValue] = useState<OptionsType>();
  const [coordinateSystem, setCoordinateSystem] = useState<CoordinateSystem>();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [viewState, setViewState] = useState<{
    longitude?: number;
    latitude?: number;
    zoom?: number;
    bounds?: LngLatBoundsLike;
  }>({
    longitude: 4.342779,
    latitude: 52.080738,
    zoom: 8,
  });
  const [features, setFeatures] = useState<ExtendedMapFeature[]>(
    field.value || [],
  );
  const [getConvertedCoordinates] = useLazyTransformCoordinatesQuery();
  const [hiddenLayers, setHiddenLayers] = useState<string[]>([]);
  const mapRef = useRef<MapRef>(null);
  const [fetchWmsFeature] = useLazyFetchFeatureQuery();

  // write this to redux store with some debouncing for performance
  // separated from all the local state changes, as the global state would get changed a bit too often otherwise
  const debouncedSaveToStore = useDebouncedCallback(
    () => {
      dispatch(
        setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: features,
        }),
      );
    },
    // delay in ms
    800,
  );

  useEffect(() => {
    // on features change, write this to store with a debounce
    if (features.length > 0 || (features.length === 0 && field.touched)) {
      debouncedSaveToStore();
    }
  }, [features, field.touched]);

  const [selectedFeatures, setSelectedFeatures] = useState<
    (string | number | undefined)[]
  >([]);

  useEffect(() => {
    const setGeoNamesFeature = async () => {
      // get the converted coordinates if needed
      const convertedCoordinates =
        coordinateSystem ?
          await getConvertedCoordinates({
            type: "Point",
            coordinates: geonamesValue?.coordinates,
            to: coordinateSystem?.value,
            from: 4326,
          })
        : undefined;

      // move map to selected GeoNames value
      setViewState({
        longitude: geonamesValue?.coordinates![0],
        latitude: geonamesValue?.coordinates![1],
        zoom: 10,
      });

      // open the map
      setOpenMap(true);

      // and add feature to map if not added yet, checks geonames id
      const newFeature: ExtendedMapFeature<Point> = {
        id: geonamesValue?.id,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: geonamesValue?.coordinates as number[],
        },
        properties: {},
        geonames: geonamesValue,
        coordinateSystem: coordinateSystem,
        originalCoordinates: convertedCoordinates?.data as
          | number[]
          | number[][]
          | number[][][],
      };
      setFeatures([
        ...new Map(
          [...features, newFeature].map((item) => [item.id, item]),
        ).values(),
      ]);
    };
    if (geonamesValue) {
      setGeoNamesFeature();
    }
  }, [geonamesValue]);

  useEffect(() => {
    // update all feature's originalCoordinates value and calculate coordinates of existing features
    // when coordinate system selection changes
    const asyncFeatures = async () => {
      const updatedCoordinatesFeatures = await Promise.all(
        // loop through all features and calculate new coordinates
        features.map(async (f) => {
          const convertedCoordinates = await getConvertedCoordinates({
            type: f.geometry.type,
            coordinates: (f.geometry as Point | Polygon | LineString)
              .coordinates,
            to: coordinateSystem?.value,
            from: 4326,
          });
          return {
            ...f,
            coordinateSystem: coordinateSystem,
            originalCoordinates: convertedCoordinates?.data as
              | number[]
              | number[][]
              | number[][][],
          };
        }),
      );
      setFeatures(updatedCoordinatesFeatures);
    };
    if (coordinateSystem) {
      console.log(coordinateSystem.bbox);
      asyncFeatures();
      // set bounding box of the selected coordinate system
      setViewState({ bounds: coordinateSystem.bbox });
    } else {
      setFeatures(
        features.map((f) => ({
          ...f,
          coordinateSystem: undefined,
          originalCoordinates: undefined,
        })),
      );
    }
  }, [coordinateSystem]);

  return (
    <Card>
      <CardHeader
        title={lookupLanguageString(field.label, i18n.language)}
        subheader={
          field.description &&
          lookupLanguageString(field.description, i18n.language)
        }
        titleTypographyProps={{ fontSize: 16 }}
        subheaderTypographyProps={{ fontSize: 12 }}
        sx={{ pb: 0, pl: 2.25, pr: 2.25 }}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ flex: 1 }}
          spacing={2}
        >
          <GeonamesApiField
            value={geonamesValue}
            setValue={setGeonamesValue}
            disabled={formDisabled || field.disabled}
            label={t("initialLocation")}
          />
          <FindCoordinateSystemField
            value={coordinateSystem}
            setValue={setCoordinateSystem}
            disabled={formDisabled || field.disabled}
            label={t("findCoordinateSystem")}
          />
          <StatusIcon status={status} title={t("drawExplanation")} />
          <Button
            sx={{ whiteSpace: "nowrap" }}
            startIcon={<PublicIcon />}
            onClick={() => setOpenMap(!openMap)}
          >
            {t("toggleMap")}
          </Button>
        </Stack>
        <Collapse unmountOnExit in={openMap}>
          <Box pt={1}>
            <GLMap
              {...viewState}
              ref={mapRef}
              onMove={(e) => setViewState(e.viewState)}
              style={{
                width: "100%",
                height: 400,
                borderRadius: "5px",
                border: "1px solid rgba(0,0,0,0.23)",
              }}
              mapStyle={`https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`}
              maxBounds={coordinateSystem?.bbox}
              onClick={async (e) => {
                /* Gets shape info for active WMS layers when clicked on. WMS service returns a GeoJSON object. Not further implemented yet. */
                if (
                  field.wmsLayers &&
                  hiddenLayers.length !== field.wmsLayers.length
                ) {
                  const map = mapRef.current!.getMap();
                  const { width, height } = map
                    .getContainer()
                    .getBoundingClientRect();
                  const { _sw, _ne } = map.getBounds();
                  const activeLayers = field.wmsLayers.filter(
                    (layer) => hiddenLayers.indexOf(layer.name) === -1,
                  );
                  // GeoJSON is in EPSG 4326, but we need 3857 for the map. Maybe use a converting lib like proj4?
                  const { data } = (await getConvertedCoordinates({
                    coordinates: `${_sw.lng},${_sw.lat};${_ne.lng},${_ne.lat}`,
                    to: 3857,
                    from: 4326,
                  })) as { data: { x: number; y: number }[] };
                  // Now we're ready to query the WMS service,
                  // with the x/y pixel coords of the point we clicked (needs to be and Int),
                  // the epsg 3857 bbox and the map pixel width and height.
                  const wmsFeatureData = await Promise.all(
                    activeLayers.map((layer) =>
                      fetchWmsFeature({
                        url: layer.source,
                        layerName: layer.name,
                        x: Math.round(e.point.x),
                        y: Math.round(e.point.y),
                        bbox: `${data[0].x},${data[0].y},${data[1].x},${data[1].y}`,
                        width: width,
                        height: height,
                      }),
                    ),
                  );
                  // Just log the result for now. We could draw the shape on the map, display a tooltip, do something in the legend, etc.
                  // Needs some thinking, keep in mind we can have multiple active layers.
                  console.log(wmsFeatureData);
                }
              }}
            >
              <NavigationControl position="top-left" />
              <ScaleControl />
              <DrawControls
                features={features}
                setFeatures={setFeatures}
                setSelectedFeatures={setSelectedFeatures}
                coordinateSystem={coordinateSystem}
              />
              <WMSLayers field={field} hiddenLayers={hiddenLayers} />
            </GLMap>
            {field.wmsLayers && (
              <Box
                sx={{
                  mt: 1,
                  border: "1px solid rgba(224, 224, 224, 1)",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6">{t("layers")}</Typography>
                <Stack direction="row" spacing={4}>
                  {field.wmsLayers.map((layer) => (
                    <WMSLegend
                      layer={layer}
                      key={layer.name}
                      toggleLayer={() =>
                        setHiddenLayers(
                          hiddenLayers.includes(layer.name) ?
                            hiddenLayers.filter((item) => item !== layer.name)
                          : [...hiddenLayers, layer.name],
                        )
                      }
                      isActive={hiddenLayers.indexOf(layer.name) === -1}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            {features.length > 0 && (
              // let's user edit features coordinates directly
              <FeatureTable
                features={features}
                setFeatures={setFeatures}
                selectedFeatures={selectedFeatures}
                coordinateSystem={coordinateSystem}
              />
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DrawMap;

/* Draws WMS image tiles on the map */
const WMSLayers = ({
  field,
  hiddenLayers,
}: {
  field: DrawMapFieldType;
  hiddenLayers: string[];
}) => {
  const map = useMap();
  const { width, height } = map.current!.getContainer().getBoundingClientRect();

  return (
    <>
      {field.wmsLayers?.map(
        (layer) =>
          hiddenLayers.indexOf(layer.name) === -1 && [
            <Source
              key="source"
              id={`${layer.name}-wms`}
              type="raster"
              tiles={[
                `${layer.source}&request=GetMap&format=image%2Fpng&styles=&transparent=true&dpi=135&map_resolution=135&format_options=dpi%3A256&width=${width}&height=${height}&crs=EPSG%3A3857&BBOX={bbox-epsg-3857}`,
              ]}
            />,
            <Layer
              key="layer"
              id={`${layer.name}-layer`}
              type="raster"
              source={`${layer.name}-wms`}
              paint={{
                "raster-opacity": 0.4,
              }}
            />,
          ],
      )}
    </>
  );
};

const WMSLegend = ({
  layer,
  toggleLayer,
  isActive,
}: {
  layer: any;
  toggleLayer: () => void;
  isActive: boolean;
}) => {
  const { data } = useFetchCapabilitiesQuery(layer.source);
  const images =
    (data &&
      (Array.isArray(data?.Capability.Layer.Layer.Style) ?
        data.Capability.Layer.Layer.Style
      : [data.Capability.Layer.Layer.Style])) ||
    undefined;
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch onClick={toggleLayer} checked={isActive} size="small" />
        }
        label={data && data.Capability.Layer.Layer.Title}
        sx={{ mb: 1 }}
      />
      {images &&
        images.map((img: any, i: number) => (
          <Box key={i}>
            <img src={img.LegendURL.OnlineResource["@_xlink:href"]} />
          </Box>
        ))}
    </Box>
  );
};

interface Column {
  id: string;
  label?: string;
  width?: number;
}

const FeatureTable = ({
  features,
  setFeatures,
  selectedFeatures,
  coordinateSystem,
}: {
  features: ExtendedMapFeature[];
  setFeatures: Dispatch<SetStateAction<ExtendedMapFeature[]>>;
  selectedFeatures: (string | number | undefined)[];
  coordinateSystem?: OptionsType;
}) => {
  const { t } = useTranslation("metadata");
  const [getConvertedCoordinates] = useLazyTransformCoordinatesQuery();

  const columns: readonly Column[] = [
    { id: "feature", label: t("featureType"), width: 50 },
    {
      id: "coordinates",
      label: t("featureCoordinates"),
      width: coordinateSystem === undefined ? 500 : 300,
    },
    ...(coordinateSystem ?
      [
        {
          id: "transposedCoordinates",
          label: t("transposedCoordinates", { id: coordinateSystem.id }),
          width: 300,
        },
      ]
    : []),
    { id: "geonames", label: t("featureGeonameRef") },
    { id: "delete", label: t("delete"), width: 50 },
  ];

  const setCoordinates = async ({
    value,
    featureIndex,
    coordinateIndex,
    groupIndex,
    coordinateSystem,
    isWgs84,
  }: {
    value: number;
    featureIndex: number;
    coordinateIndex: number;
    groupIndex?: number;
    coordinateSystem?: OptionsType;
    isWgs84?: boolean;
  }) => {
    // conversion expects a lat/lon pair.
    // set the new coordinates
    // A user can either both the WSG84 coordinates, and the coordinates from the optional alternative system
    // We need to handle both changes and calculate the other coordinate system's values
    // For simplicity, our originalCoordinates object has the same geoJson structure as the geometry.coordinates object
    const newFeatures = await Promise.all(
      features.map(async (feature, index) => {
        if (index === featureIndex) {
          const coordinatesToChange: number[] | number[][] | number[][][] =
            isWgs84 ?
              (feature.geometry as Point | Polygon | LineString).coordinates
            : (feature.originalCoordinates as
                | number[]
                | number[][]
                | number[][][]);

          const updatedCoordinates =
            feature.geometry.type === "Point" ?
              (coordinatesToChange as number[]).map((coordinate, i) =>
                i === coordinateIndex ? value : coordinate,
              )
            : feature.geometry.type === "LineString" ?
              (coordinatesToChange as number[][]).map((coordinateGroup, i) =>
                i === groupIndex ?
                  coordinateGroup.map((coordinate, j) =>
                    j === coordinateIndex ? value : coordinate,
                  )
                : coordinateGroup,
              )
            : feature.geometry.type === "Polygon" ?
              (() => {
                // First, update the first set of coordinates
                const updatedCoordinates = (
                  coordinatesToChange as number[][][]
                )[0].map((coordinateGroup, i) =>
                  i === groupIndex ?
                    coordinateGroup.map((coordinate, j) =>
                      j === coordinateIndex ? value : coordinate,
                    )
                  : coordinateGroup,
                );
                // Ensure the last set of coordinates is the same as the first one
                const firstSet = updatedCoordinates[0];
                updatedCoordinates[updatedCoordinates.length - 1] = firstSet;

                return [updatedCoordinates];
              })()
            : (feature.geometry as any).coordinates;

          // convert coords if needed
          const convertedCoordinates =
            coordinateSystem ?
              await getConvertedCoordinates({
                type: feature.geometry.type,
                coordinates: updatedCoordinates,
                to: isWgs84 ? coordinateSystem.value : 4326,
                from: isWgs84 ? 4326 : coordinateSystem.value,
              })
            : null;

          const updatedFeature = {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates:
                isWgs84 ? updatedCoordinates : convertedCoordinates?.data,
            },
            geonames: undefined,
            originalCoordinates:
              isWgs84 && coordinateSystem ?
                convertedCoordinates?.data
              : updatedCoordinates,
          };
          return updatedFeature;
        } else {
          return feature;
        }
      }),
    );
    // Update the features and geoNames
    setFeatures(newFeatures);
  };

  const setGeonames = (
    geonamesValue: OptionsType | undefined,
    index: number,
  ) => {
    // set the new geonames value
    setFeatures(
      features.map((feature, i) =>
        i === index ? { ...feature, geonames: geonamesValue } : feature,
      ),
    );
  };

  const deleteFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <TableContainer
      sx={{
        maxHeight: 440,
        border: "1px solid rgba(224, 224, 224, 1)",
        mt: 1,
        borderRadius: 1,
      }}
      component={Box}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ width: column.width }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature, i) => (
            <TableRow
              key={i}
              sx={{
                backgroundColor:
                  selectedFeatures.indexOf(feature.id) !== -1 ?
                    "#fffae5"
                  : "transparent",
              }}
            >
              <TableCell>
                {feature.geometry.type === "Point" ?
                  <PlaceIcon color={!feature.geonames ? "error" : "primary"} />
                : feature.geometry.type === "LineString" ?
                  <PolylineIcon
                    color={!feature.geonames ? "error" : "primary"}
                  />
                : feature.geometry.type === "Polygon" ?
                  <PentagonIcon
                    color={!feature.geonames ? "error" : "primary"}
                  />
                : null}
              </TableCell>
              <TableCell>
                <FeatureCoordinateCell
                  feature={feature}
                  onChange={setCoordinates}
                  featureIndex={i}
                  coordinateSystem={coordinateSystem}
                  isWgs84={true}
                />
              </TableCell>
              {coordinateSystem && (
                <TableCell>
                  <FeatureCoordinateCell
                    feature={feature}
                    onChange={setCoordinates}
                    featureIndex={i}
                    coordinateSystem={coordinateSystem}
                  />
                </TableCell>
              )}
              <TableCell>
                <ReverseLookupGeonamesField
                  setValue={setGeonames}
                  value={feature.geonames}
                  featureIndex={i}
                  lat={
                    feature.geometry.type === "Point" ?
                      feature.geometry.coordinates[1]
                    : feature.geometry.type === "LineString" ?
                      feature.geometry.coordinates[
                        Math.floor(feature.geometry.coordinates.length / 2)
                      ][1]
                    : (feature.geometry as Polygon).coordinates[0][
                        Math.floor(
                          (feature.geometry as Polygon).coordinates[0].length /
                            2,
                        )
                      ][1]

                  }
                  lng={
                    feature.geometry.type === "Point" ?
                      feature.geometry.coordinates["0"]
                    : feature.geometry.type === "LineString" ?
                      feature.geometry.coordinates[
                        Math.floor(feature.geometry.coordinates.length / 2)
                      ][0]
                    : (feature.geometry as Polygon).coordinates[0][
                        Math.floor(
                          (feature.geometry as Polygon).coordinates[0].length /
                            2,
                        )
                      ][0]

                  }
                />
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  aria-label={t("delete") as string}
                  size="small"
                  onClick={() => deleteFeature(i)}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const FeatureCoordinateCell = ({
  feature,
  onChange,
  featureIndex,
  isWgs84,
  coordinateSystem,
}: {
  feature: ExtendedMapFeature;
  featureIndex: number;
  onChange: (object: any) => void;
  isWgs84?: boolean;
  coordinateSystem?: OptionsType;
}) => {
  // Check if this input box is wsg84 or a different coordinate system
  const coordinates =
    isWgs84 ?
      (feature.geometry as Point | Polygon | LineString).coordinates
    : feature.originalCoordinates;

  return (
    feature.geometry.type === "Point" ?
      <CoordinateGroup
        onChange={onChange}
        coordinates={coordinates as number[]}
        featureIndex={featureIndex}
        isWgs84={isWgs84}
        coordinateSystem={coordinateSystem}
      />
    : feature.geometry.type === "LineString" ?
      Array.isArray(coordinates) &&
      (coordinates as number[][]).map((coordGroup, groupIndex) => (
        <CoordinateGroup
          key={groupIndex}
          onChange={onChange}
          coordinates={coordGroup}
          featureIndex={featureIndex}
          isWgs84={isWgs84}
          groupIndex={groupIndex}
          coordinateSystem={coordinateSystem}
        />
      ))
    : feature.geometry.type === "Polygon" ?
      Array.isArray(coordinates) &&
      (coordinates as number[][][])[0].map((coordGroup, groupIndex) => (
        <CoordinateGroup
          key={groupIndex}
          onChange={onChange}
          coordinates={coordGroup}
          featureIndex={featureIndex}
          isWgs84={isWgs84}
          groupIndex={groupIndex}
          disabled={
            groupIndex ===
            (feature.geometry as Polygon).coordinates[0].length - 1
          }
          coordinateSystem={coordinateSystem}
        />
      ))
    : null
  );
};

const CoordinateGroup = ({
  onChange,
  coordinates,
  featureIndex,
  isWgs84,
  groupIndex,
  disabled,
  coordinateSystem,
}: {
  onChange: (object: any) => void;
  coordinates?: number[] | number[][] | number[][][];
  featureIndex: number;
  isWgs84?: boolean;
  groupIndex?: number;
  disabled?: boolean;
  coordinateSystem?: OptionsType;
}) => {
  const { t } = useTranslation("metadata");

  return (
    <Stack spacing={1} direction="row" mb={1}>
      {coordinates?.map((coord, coordinateIndex) => (
        <TextField
          disabled={disabled}
          type="number"
          size="small"
          value={coord}
          key={coordinateIndex}
          label={
            coordinateIndex === 1 ?
              t(isWgs84 ? "lat" : "Y")
            : t(isWgs84 ? "lng" : "X")
          }
          onChange={(e) =>
            onChange({
              value: parseFloat(e.target.value),
              featureIndex: featureIndex,
              coordinateIndex: coordinateIndex,
              groupIndex: groupIndex,
              coordinateSystem: coordinateSystem,
              isWgs84: isWgs84,
            })
          }
        />
      ))}
    </Stack>
  );
};

const controls = [
  "simple_select",
  "draw_point",
  "draw_line_string",
  "draw_polygon",
];

type FeaturesEvent = { features: ExtendedMapFeature[]; action?: string };

const DrawControls = ({
  features,
  setFeatures,
  setSelectedFeatures,
  coordinateSystem,
}: {
  features: ExtendedMapFeature[];
  setFeatures: Dispatch<SetStateAction<ExtendedMapFeature[]>>;
  setSelectedFeatures: Dispatch<
    SetStateAction<(string | number | undefined)[]>
  >;
  coordinateSystem?: OptionsType;
}) => {
  const { t } = useTranslation("metadata");
  const [selectedMode, setSelectedMode] = useState(controls[0]);
  const [updatedFeatures, setUpdatedFeatures] =
    useState<ExtendedMapFeature[]>();
  const [getConvertedCoordinates] = useLazyTransformCoordinatesQuery();

  const onUpdate = useCallback((e: FeaturesEvent) => {
    // Clear geonames key for each feature in the new array,
    // reference must be removed when points change
    const updatedFeatures = e.features.map((feature) => ({
      ...feature,
      geonames: undefined,
    }));

    setUpdatedFeatures(updatedFeatures);
    setSelectedMode(controls[0]);
  }, []);

  useEffect(() => {
    // Have to pull this out of the useCallback function onUpdate, otherwise no access to current coordinate system
    // Listens to any changes in (local state) features, then applies coordinate transformation if neccessary, and updates global features.
    const setNewFeatures = (updatedCoordinateFeatures: ExtendedMapFeature[]) =>
      setFeatures((currFeatures) => [
        ...new Map(
          [...currFeatures, ...updatedCoordinateFeatures].map((item) => [
            item.id,
            item,
          ]),
        ).values(),
      ]);
    const updateOriginalCoordinates = async () => {
      // Do a conversion to the optionally selected alternative coordinate system here
      const updatedCoordinateFeatures = await Promise.all(
        updatedFeatures!.map(async (feature) => {
          const originalCoordinates = await getConvertedCoordinates({
            type: feature.geometry.type,
            coordinates: (feature.geometry as Point | Polygon | LineString)
              .coordinates,
            to: coordinateSystem?.value,
            from: 4326,
          });
          return {
            ...feature,
            originalCoordinates: originalCoordinates?.data as
              | number[]
              | number[][]
              | number[][][],
          };
        }),
      );
      setNewFeatures(updatedCoordinateFeatures);
    };
    if (updatedFeatures && coordinateSystem?.value) {
      updateOriginalCoordinates();
    } else if (updatedFeatures) {
      setNewFeatures(updatedFeatures);
    }
  }, [updatedFeatures]);

  const onDelete = useCallback((e: FeaturesEvent) => {
    const changedFeatureIds = new Set(e.features.map((feature) => feature.id));
    setFeatures((currFeatures) =>
      currFeatures.filter((feature) => !changedFeatureIds.has(feature.id)),
    );
    setSelectedMode(controls[0]);
  }, []);

  const onSelectionChange = useCallback((e: FeaturesEvent) => {
    setSelectedFeatures(e.features.map((feature) => feature.id));
  }, []);

  // manual key listener, since delete is broken in the map libre / mapbox draw combo
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, drawControl: MapboxDraw) => {
      const selectedFeatures = drawControl.getSelected();
      if (event.key === "Delete" && selectedFeatures.features.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        // remove features from store
        onDelete(selectedFeatures);
        // remove them from map
        drawControl.trash();
      }
    },
    [],
  );

  return (
    <Paper
      sx={{
        position: "absolute",
        right: "1rem",
        top: "1rem",
      }}
    >
      <List>
        {controls.map((control) => (
          <ListItem key={control} disablePadding>
            <ListItemButton
              onClick={() => setSelectedMode(control)}
              selected={control === selectedMode}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {control === "simple_select" ?
                  <HighlightAltIcon />
                : control === "draw_point" ?
                  <PlaceIcon />
                : control === "draw_line_string" ?
                  <PolylineIcon />
                : control === "draw_polygon" ?
                  <PentagonIcon />
                : null}
              </ListItemIcon>
              <ListItemText primary={t(control)} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              // just simulate the delete keyboard press event on the map canvas
              const target = document.querySelector(".maplibregl-canvas");
              if (target) {
                const keyboardEvent = new KeyboardEvent("keydown", {
                  key: "Delete",
                  code: "Delete",
                  keyCode: 46,
                  charCode: 46,
                  bubbles: true,
                  cancelable: true,
                });
                target.dispatchEvent(keyboardEvent);
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary={t("delete")} />
          </ListItemButton>
        </ListItem>
      </List>
      <DrawControl
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        mode={selectedMode}
        onKeyDown={handleKeyDown}
        features={features}
        onSelectionChange={onSelectionChange}
      />
    </Paper>
  );
};

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  onSelectionChange,
  mode,
  onKeyDown,
  features,
}: {
  onCreate: (e: FeaturesEvent, system: number) => void;
  onUpdate: (e: FeaturesEvent, system: number) => void;
  onDelete: (e: FeaturesEvent) => void;
  onSelectionChange: (e: FeaturesEvent) => void;
  mode: string;
  onKeyDown: (e: KeyboardEvent, c: MapboxDraw) => void;
  features: ExtendedMapFeature[];
}) => {
  const control = useControl<any>(
    () =>
      new MapboxDraw({
        // remove default controls
        displayControlsDefault: false,
        defaultMode: mode,
        keybindings: true,
        clickBuffer: 5,
      }),
    ({ map }: { map: any }) => {
      map.on("draw.create", onCreate);
      map.on("draw.update", onUpdate);
      map.on("draw.delete", onDelete);
      map.on("draw.selectionchange", onSelectionChange);

      // Attach the keydown event to the map container
      const canvas = map.getCanvas();
      const handleKeyDownInternal = (event: KeyboardEvent) =>
        onKeyDown(event, control);
      canvas.addEventListener("keydown", handleKeyDownInternal);
      // Store the reference to the internal handler for cleanup
      map._handleKeyDownInternal = handleKeyDownInternal;
    },
    ({ map }: { map: any }) => {
      map.off("draw.create", onCreate);
      map.off("draw.update", onUpdate);
      map.off("draw.delete", onDelete);
      map.off("draw.selectionchange", onSelectionChange);

      // Clean up the keydown event listener
      const canvas = map.getCanvas();
      canvas.removeEventListener("keydown", map._handleKeyDownInternal);
    },
  );

  useEffect(() => {
    // change drawing mode based on user selection
    control.changeMode(mode);
  }, [mode]);

  useEffect(() => {
    // if features prop changes, reflect that on map
    if (control) {
      control.set({
        type: "FeatureCollection",
        features: features,
      });
    }
  }, [features, control]);

  return null;
};

// TODO: find something else for this, as this (geonames extendedFindNearby) does not work great and does not
// always find a relevant value. Also, for multipoint shapes, we can only check the nearby value of a single point,
// which might not be the most relevant point.
const ReverseLookupGeonamesField = ({
  lat,
  lng,
  featureIndex,
  value,
  setValue,
  disabled,
}: {
  lat: number;
  lng: number;
  featureIndex: number;
  value: OptionsType | undefined;
  setValue: (option: OptionsType | undefined, index: number) => void;
  disabled?: boolean;
}) => {
  // TODO: we need a better reverse lookup

  const { t } = useTranslation("metadata");
  const [inputValue, setInputValue] = useState<string>("");
  // fetch on open, not directly on prop change
  const [open, setOpen] = useState(false);
  // Fetch data right away, based on coordinates
  const { data, isFetching, isLoading } =
    useFetchPlaceReverseLookupQuery<QueryReturnType>(
      { lat: lat, lng: lng },
      { skip: !open },
    );

  return (
    <Autocomplete
      fullWidth
      includeInputInList
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={data?.response || []}
      value={value || null}
      inputValue={inputValue || (value?.label as string) || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("findPlace")}
          size="small"
          error={!value}
        />
      )}
      onChange={(_e, newValue, _reason) =>
        setValue(newValue as OptionsType, featureIndex)
      }
      filterOptions={(x) => x}
      onInputChange={(e, newValue) => {
        e && e.type === "change" && setInputValue(newValue);
        e && (e.type === "click" || e.type === "blur") && setInputValue("");
      }}
      noOptionsText={t("noResults")}
      loading={isLoading || isFetching}
      loadingText={
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          {t("loading")} <CircularProgress size={18} />
        </Stack>
      }
      forcePopupIcon
      clearOnBlur
      disabled={disabled}
      getOptionKey={(option) => option.value}
    />
  );
};

const GeonamesApiField = ({
  value,
  setValue,
  disabled,
  label,
  width,
}: {
  value?: OptionsType;
  setValue: (v: OptionsType) => void;
  disabled?: boolean;
  label?: string;
  width?: string | number;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchGeonamesFreeTextQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <TypeaheadField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      value={value}
      label={label}
      setValue={setValue}
      disabled={disabled}
      isLoading={isLoading}
      isFetching={isFetching}
      width={width}
      api="geonames"
    />
  );
};

const FindCoordinateSystemField = ({
  value,
  setValue,
  disabled,
  label,
  width,
}: {
  value?: OptionsType;
  setValue: (v: CoordinateSystem) => void;
  disabled?: boolean;
  label?: string;
  width?: string | number;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } = useFetchCoordinateSystemsQuery<
    QueryReturnType<CoordinateSystem>
  >(debouncedInputValue, {
    skip: debouncedInputValue === "",
  });

  return (
    <TypeaheadField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      value={value}
      label={label}
      setValue={setValue}
      disabled={disabled}
      isLoading={isLoading}
      isFetching={isFetching}
      width={width}
      api="maptiler"
    />
  );
};

const TypeaheadField = ({
  inputValue,
  setInputValue,
  debouncedInputValue,
  data,
  value,
  label,
  setValue,
  disabled,
  isLoading,
  isFetching,
  width,
  api,
}: {
  value?: OptionsType | CoordinateSystem;
  setValue: (v: OptionsType | CoordinateSystem) => void;
  disabled?: boolean;
  label?: string;
  width?: string | number;
  inputValue?: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  debouncedInputValue?: string;
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  api: string;
}) => {
  const { t } = useTranslation("metadata");
  return (
    <Autocomplete
      fullWidth={width ? false : true}
      sx={{
        width: width,
      }}
      includeInputInList
      options={
        (
          inputValue &&
          debouncedInputValue === inputValue &&
          data &&
          data.arg === debouncedInputValue
        ) ?
          data.response
        : []
      }
      value={value || null}
      inputValue={inputValue || (value?.label as string) || ""}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(_e, newValue, _reason) => setValue(newValue as OptionsType)}
      filterOptions={(x) => x}
      onInputChange={(e, newValue) => {
        e && e.type === "change" && setInputValue(newValue);
        e && (e.type === "click" || e.type === "blur") && setInputValue("");
      }}
      noOptionsText={
        !inputValue ? t("startTyping", { api: t(api) }) : t("noResults")
      }
      loading={isLoading || isFetching || inputValue !== debouncedInputValue}
      loadingText={
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          {t("loading")} <CircularProgress size={18} />
        </Stack>
      }
      forcePopupIcon
      clearOnBlur
      disabled={disabled}
      getOptionKey={(option) => option.value}
    />
  );
};
