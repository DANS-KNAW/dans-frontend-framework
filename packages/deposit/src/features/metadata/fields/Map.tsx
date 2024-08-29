import { useEffect, useState, useCallback, type SetStateAction, type Dispatch } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { setField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { OptionsType, ExtendedMapFeature, MapFeatureType } from "../../../types/MetadataFields";
import type { DrawMapFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import GLMap, { ScaleControl, NavigationControl, useControl } from "react-map-gl/maplibre";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './Map.css';
import type { Point, Polygon } from 'geojson';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PolylineIcon from '@mui/icons-material/Polyline';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import PentagonIcon from '@mui/icons-material/Pentagon';
import { useFetchGeonamesFreeTextQuery, useFetchPlaceReverseLookupQuery } from "../api/geonames";
import type { QueryReturnType } from "../../../types/Api";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import Collapse from '@mui/material/Collapse';
import PublicIcon from '@mui/icons-material/Public';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

/** 
 * Map field
 * Lookup base location/point via Geonames.
 * Allows user to edit selected point from Geonames location, or draw a line, square, polygon, circle.
 * Gets saved as GeoJSON.
 * Also allows user to select Geobasis standard.
*/

const DrawMap = ({
  field,
  sectionIndex,
}: DrawMapFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const [geonamesValue, setGeonamesValue] = useState<OptionsType>();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [viewState, setViewState] = useState({
    longitude: 4.342779,
    latitude: 52.080738,
    zoom: 8,
  });
  const [ features, setFeatures ] = useState<ExtendedMapFeature[]>(field.value || []);

  // write this to redux store with some debouncing for performance
  const debouncedSaveToStore = useDebouncedCallback(
    () => {
      console.log('dispatching')
      dispatch(
        setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: features,
        }),
      );
    },
    // delay in ms
    800
  );

  useEffect(() => {
    // on features change, write this to store with a debounce
    if (features.length > 0 || (features.length === 0 && field.touched)) {
      debouncedSaveToStore();
    }
  }, [features, field.touched])
  console.log(features)

  const [ selectedFeatures, setSelectedFeatures ] = useState<(string | number | undefined)[]>([]);

  useEffect(() => {
    if (geonamesValue) {
      // move map to selected GeoNames value
      setViewState({
        longitude: geonamesValue.coordinates![0],
        latitude: geonamesValue.coordinates![1],
        zoom: 10,
      });
      setOpenMap(true);
      // and add it to map if not added yet, checks geonames id
      const newFeature: ExtendedMapFeature<Point> = {
        id: geonamesValue.id,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: geonamesValue.coordinates as number[],
        },
        properties: {},
        geonames: geonamesValue,
      };
      setFeatures(
        [...new Map([...features, newFeature].map(item => [item.id, item])).values()]
      );
    }
  }, [geonamesValue]);

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
        <Stack direction="row" alignItems="center" sx={{ flex: 1 }} spacing={2}>
          <GeonamesApiField 
            value={geonamesValue}
            setValue={setGeonamesValue}
            disabled={formDisabled || field.disabled}
            label={t("initialLocation")}
          />
          <StatusIcon
            status={status}
            title={t('drawExplanation')}
            subtitle={t("apiValue", { api: t('geonames') }) as string}
          />
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
              onMove={(e) => setViewState(e.viewState)}
              style={{
                width: '100%', 
                height: 400,
                borderRadius: '5px',
                border: "1px solid rgba(0,0,0,0.23)"
              }}
              mapStyle={`https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`}
            >
              <NavigationControl position="top-left" />
              <ScaleControl />
              <DrawControls features={features} setFeatures={setFeatures} setSelectedFeatures={setSelectedFeatures} />
            </GLMap>
            {features.length > 0 &&
              // let's user edit features coordinates directly
              // todo: how to present this??
              // also, let user select a corresponding geonames option???
              <FeatureTable features={features} setFeatures={setFeatures} selectedFeatures={selectedFeatures} />
            }
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DrawMap;

interface Column {
  id: string;
  label?: string;
  width?: number;
}

const FeatureTable = ({ features, setFeatures, selectedFeatures }: {
  features: ExtendedMapFeature[];
  setFeatures: Dispatch<SetStateAction<ExtendedMapFeature[]>>;
  selectedFeatures: (string | number | undefined)[];
}) => {
  const { t } = useTranslation("metadata");

  const columns: readonly Column[] = [
    { id: 'feature', label: t('featureType'), width: 50 },
    { id: 'coordinates', label: t('featureCoordinates'), width: 500 },
    { id: 'geonames', label: t('featureGeonameRef') },
    { id: 'delete', label: t('delete'), width: 50 },
  ];

  const setCoordinates = (coord: string, featureIndex: number, coordIndexes: number[], isFirst?: boolean) => {
    // set the new coordinates
    let newFeatures = [...features];
    let target: any = (newFeatures[featureIndex].geometry as MapFeatureType).coordinates;

    // Traverse the array up to the point where you're modifying a single number
    for (let i = 0; i < coordIndexes.length - 1; i++) {
      target = target[coordIndexes[i]];
    }

    // Modify the specific coordinate (either lat or lng)
    target[coordIndexes[coordIndexes.length - 1]] = parseFloat(coord);

    // Close the polygon if necessary
    if (isFirst && (newFeatures[featureIndex].geometry as Polygon).type === 'Polygon') {
      const polygon = newFeatures[featureIndex].geometry as Polygon;
      const firstCoordinate = polygon.coordinates[0][0];
      polygon.coordinates[0][polygon.coordinates[0].length - 1] = [...firstCoordinate];
    }

    // Update the features and geoNames
    setFeatures(newFeatures);
    setGeonames(undefined, featureIndex);
  }

  const setGeonames = (geonamesValue: OptionsType | undefined, index: number) => {
    // set the new geonames value
    setFeatures(features.map((feature, i) => 
      i === index ? { ...feature, geonames: geonamesValue } : feature
    ));
  }

  const deleteFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  }

  return (
    <TableContainer 
      sx={{ 
        maxHeight: 440,
        border: "1px solid rgba(224, 224, 224, 1)",
        mt: 1,
        borderRadius: 1,
      }} 
      component={Box}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                style={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature, i) =>
            <TableRow key={i} sx={{
              backgroundColor: selectedFeatures.indexOf(feature.id) !== -1 ? '#fffae5' : 'transparent'
            }}>
              <TableCell>
                {
                  feature.geometry.type === "Point" 
                  ? <PlaceIcon color={!feature.geonames ? "error" : "primary"} />
                  : feature.geometry.type === "LineString" 
                  ? <PolylineIcon color={!feature.geonames ? "error" : "primary"} />
                  : feature.geometry.type === "Polygon"
                  ? <PentagonIcon color={!feature.geonames ? "error" : "primary"} />
                  : null
                }
              </TableCell>
              <TableCell>
                {
                  feature.geometry.type === "Point" && 
                  <Stack spacing={1} direction="row">
                    {feature.geometry.coordinates.map((coord, j) =>
                      <TextField 
                        type="number"
                        key={j} 
                        size="small" 
                        value={coord} 
                        label={j === 1 ? t("lat") : t("lng")} 
                        onChange={(e) => setCoordinates(e.target.value, i, [j])}
                      />
                    )}
                  </Stack>
                }
                { 
                  feature.geometry.type === "LineString" &&
                  feature.geometry.coordinates.map((coord, j) =>
                    <Stack spacing={1} direction="row" mb={1} key={j}>
                      {coord.map((c, k) => 
                        <TextField 
                          type="number"
                          size="small" 
                          value={c} 
                          key={k}
                          label={k === 1 ? t("lat") : t("lng")}
                          onChange={(e) => setCoordinates(e.target.value, i, [j, k])}
                        />
                      )}
                    </Stack>
                  )
                }
                {
                  feature.geometry.type === "Polygon" &&
                  feature.geometry.coordinates[0].map((coord, j) =>
                    <Stack spacing={1} direction="row" mb={1} key={j}>
                      {coord.map((c, k) => 
                        <TextField 
                          disabled={j === (feature.geometry as Polygon).coordinates[0].length - 1}
                          type="number"
                          size="small" 
                          value={c} 
                          key={k}
                          label={k === 1 ? t("lat") : t("lng")}
                          onChange={(e) => setCoordinates(e.target.value, i, [0, j, k], j === 0)}
                        />
                      )}
                    </Stack>
                  )
                }
              </TableCell>
              <TableCell>
                <ReverseLookupGeonamesField 
                  setValue={setGeonames}
                  value={feature.geonames}
                  featureIndex={i}
                  lat={
                    feature.geometry.type === "Point" ?
                    feature.geometry.coordinates[1] :
                    feature.geometry.type === "LineString" ?
                    feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)][1] :
                    (feature.geometry as Polygon).coordinates[0][Math.floor((feature.geometry as Polygon).coordinates[0].length / 2)][1]
                  } 
                  lng={
                    feature.geometry.type === "Point" ?
                    feature.geometry.coordinates["0"] :
                    feature.geometry.type === "LineString" ?
                    feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)][0] :
                    (feature.geometry as Polygon).coordinates[0][Math.floor((feature.geometry as Polygon).coordinates[0].length / 2)][0]
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
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


const controls = ["simple_select", "draw_point", "draw_line_string", "draw_polygon"];

type FeaturesEvent = {features: ExtendedMapFeature[], action?: string};

const DrawControls = ({ features, setFeatures, setSelectedFeatures }: {
  features: ExtendedMapFeature[];
  setFeatures: Dispatch<SetStateAction<ExtendedMapFeature[]>>;
  setSelectedFeatures: Dispatch<SetStateAction<(string | number | undefined)[]>>;
}) => {
  const { t } = useTranslation("metadata");
  const [ selectedMode, setSelectedMode ] = useState(controls[0]);

  const onUpdate = useCallback((e: FeaturesEvent) => {
    console.log('update called')

    // Clear 'properties' key for each feature in the new array
    // So geonames reference is removed when points change
    const updatedFeatures = e.features.map(feature => ({
      ...feature,
      geonames: undefined,
    }));

    setFeatures(currFeatures => 
      [...new Map([...currFeatures, ...updatedFeatures].map(item => [item.id, item])).values()]
    );
    setSelectedMode(controls[0]);
  }, []);

  const onDelete = useCallback((e: FeaturesEvent) => {
    console.log('delete called')
    const changedFeatureIds = new Set(e.features.map(feature => feature.id));
    setFeatures(currFeatures =>
      currFeatures.filter(feature => !changedFeatureIds.has(feature.id))
    );
    setSelectedMode(controls[0]);
  }, []);

  const onSelectionChange = useCallback((e: FeaturesEvent) => {
    console.log('selection changed');
    console.log(e)
    // const changedFeatureIds = new Set(e.features.map(feature => feature.id));
    setSelectedFeatures(e.features.map(feature => feature.id));
  }, []);

  // manual key listener, since delete is broken in the map libre / mapbox draw combo
  const handleKeyDown = useCallback((event: KeyboardEvent, drawControl: MapboxDraw) => {
    const selectedFeatures = drawControl.getSelected();
    if (event.key === 'Delete' && selectedFeatures.features.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      // remove features from store
      onDelete(selectedFeatures);
      // remove them from map
      drawControl.trash();
    }
  }, []);

  return (
    <Paper
      sx={{
        position: "absolute",
        right: "1rem",
        top: "1rem"
      }}
    >
      <List>
        {controls.map(control =>
          <ListItem key={control} disablePadding>
            <ListItemButton 
              onClick={() => setSelectedMode(control)}
              selected={control === selectedMode}
            >
              <ListItemIcon sx={{minWidth: 40}}>
                { 
                    control === "simple_select" 
                  ? <HighlightAltIcon />
                  : control === "draw_point"
                  ? <PlaceIcon />
                  : control === "draw_line_string"
                  ? <PolylineIcon />
                  : control === "draw_polygon"
                  ? <PentagonIcon />
                  : null
                }
              </ListItemIcon>
              <ListItemText primary={t(control)} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            // just simulate the delete keyboard press event on the map canvas
            const target = document.querySelector('.maplibregl-canvas');
            if (target) {
              const keyboardEvent = new KeyboardEvent('keydown', {
                key: 'Delete',
                code: 'Delete',
                keyCode: 46,
                charCode: 46, 
                bubbles: true,
                cancelable: true
              });
              target.dispatchEvent(keyboardEvent);
            }
          }}>
            <ListItemIcon sx={{minWidth: 40}}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary={t('delete')} />
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
  )
}

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  onSelectionChange,
  mode,
  onKeyDown,
  features,
}: {
  onCreate: (e: FeaturesEvent) => void;
  onUpdate: (e: FeaturesEvent) => void;
  onDelete: (e: FeaturesEvent) => void;
  onSelectionChange: (e: FeaturesEvent) => void;
  mode: string;
  onKeyDown: (e: KeyboardEvent, c: MapboxDraw) => void;
  features: ExtendedMapFeature[];
}) => {
  const control = useControl<any>(
    () => new MapboxDraw({
      // remove default controls
      displayControlsDefault: false,
      defaultMode: mode,
      keybindings: true,
      clickBuffer: 5,
    }),
    ({map}: {map: any}) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
      map.on('draw.selectionchange', onSelectionChange);
      
      // Attach the keydown event to the map container
      const canvas = map.getCanvas();
      const handleKeyDownInternal = (event: KeyboardEvent) => onKeyDown(event, control);
      canvas.addEventListener('keydown', handleKeyDownInternal);
      // Store the reference to the internal handler for cleanup
      map._handleKeyDownInternal = handleKeyDownInternal;

    },
    ({map}: {map: any}) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
      map.off('draw.selectionchange', onSelectionChange);

      // Clean up the keydown event listener
      const canvas = map.getCanvas();
      canvas.removeEventListener('keydown', map._handleKeyDownInternal);
    }
  );

  useEffect(() => {
    // change drawing mode based on user selection
    control.changeMode(mode);
  }, [mode]);

  useEffect(() => {
    // if features prop changes, reflect that on map
    if (control) {
      control.set({
        type: 'FeatureCollection',
        features: features,
      })
    }
  }, [features, control]);

  return null;
}

const ReverseLookupGeonamesField = ({
  lat, 
  lng, 
  featureIndex,
  value,
  setValue,
  disabled
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
    useFetchPlaceReverseLookupQuery<QueryReturnType>({lat: lat, lng: lng}, {skip: !open});

  return (
    <Autocomplete
      fullWidth
      includeInputInList
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={data?.response || []}
      value={value || null}
      inputValue={inputValue || value?.label as string || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("findPlace")}
          size="small"
          error={!value}
        />
      )}
      onChange={(_e, newValue, _reason) => setValue(newValue as OptionsType, featureIndex)}
      filterOptions={(x) => x}
      onInputChange={(e, newValue) => {
        e && e.type === "change" && setInputValue(newValue);
        e && (e.type === "click" || e.type === "blur") && setInputValue("");
      }}
      noOptionsText={t("noResults")}
      loading={isLoading || isFetching}
      loadingText={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="end"
        >
          {t("loading")} <CircularProgress size={18} />
        </Stack>
      }
      forcePopupIcon
      clearOnBlur
      disabled={disabled}
      getOptionKey={(option) => option.value}
    />
  )
}

const GeonamesApiField = ({
  value,
  setValue,
  disabled,
  label
}: {
  value?: OptionsType;
  setValue: (v: OptionsType) => void;
  disabled?: boolean;
  label?: string;
}) => {
  const { t } = useTranslation("metadata");
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchGeonamesFreeTextQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <Autocomplete
      fullWidth
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
      inputValue={inputValue || value?.label as string || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />
      )}
      onChange={(_e, newValue, _reason) => setValue(newValue as OptionsType)}
      filterOptions={(x) => x}
      onInputChange={(e, newValue) => {
        e && e.type === "change" && setInputValue(newValue);
        e && (e.type === "click" || e.type === "blur") && setInputValue("");
      }}
      noOptionsText={!inputValue ? t("startTyping", {api: t("geonames")}) : t("noResults")}
      loading={isLoading || isFetching || inputValue !== debouncedInputValue}
      loadingText={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="end"
        >
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