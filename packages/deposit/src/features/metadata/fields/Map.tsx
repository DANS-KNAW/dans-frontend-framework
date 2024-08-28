import { useEffect, useState, useCallback, type SetStateAction, type Dispatch } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation, Trans } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { setField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { OptionsType } from "../../../types/MetadataFields";
import type { DrawMapFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import GLMap, { ScaleControl, NavigationControl, useControl } from "react-map-gl/maplibre";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './Map.css';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
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
import Typography from "@mui/material/Typography";
import { useDebounce } from "use-debounce";
import Collapse from '@mui/material/Collapse';
import PublicIcon from '@mui/icons-material/Public';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
  const [ features, setFeatures ] = useState<Feature[]>([]);
  // todo: write this to redux store, import proper geojson type from map lib
  console.log(features)

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
      const newFeature = {
        id: geonamesValue.id,
        type: "Feature",
        properties: {
          geoNames: geonamesValue,
        },
        geometry: {
          type: "Point",
          coordinates: geonamesValue.coordinates,
        },
      };
      setFeatures(
        [...new Map([...features, newFeature].map(item => [item.id, item])).values()]
      );
    }
  }, [geonamesValue]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" sx={{ flex: 1 }} spacing={2}>
        <GeonamesApiField 
          value={geonamesValue}
          setValue={setGeonamesValue}
          disabled={formDisabled || field.disabled}
          label={lookupLanguageString(field.label, i18n.language)}
        />
        <StatusIcon
          status={status}
          title={lookupLanguageString(field.description, i18n.language)}
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
          <DrawControls features={features} setFeatures={setFeatures} />
        </GLMap>
        {features.length > 0 &&
          // let's user edit features coordinates directly
          // todo: how to present this??
          // also, let user select a corresponding geonames option???
          <FeatureTable features={features} setFeatures={setFeatures} />
        }
      </Collapse>
    </Box>
  );
};

export default DrawMap;

interface Column {
  id: string;
  label: string;
  width?: number;
}

const columns: readonly Column[] = [
  { id: 'feature', label: 'Type', width: 50 },
  { id: 'coordinates', label: 'Coordinates', width: 500 },
  { id: 'geonames', label: 'Geoname reference' },
];

const FeatureTable = ({ features, setFeatures }: {
  features: Feature[];
  setFeatures: Dispatch<SetStateAction<Feature[]>>;
}) => {
  const { t } = useTranslation("metadata");

  const setCoordinates = (coord: string, indexes: number[], isFirst?: boolean) => {
    // set the new coordinates
    const newFeatures = [...features];
    let target = newFeatures[indexes[0]].geometry.coordinates;
    for (let i = 1; i < indexes.length - 1; i++) {
      target = target[indexes[i]];
    }
    target[indexes[indexes.length - 1]] = parseFloat(coord);

    // For a polygon, we need to set the last coordinate pair to the first one, to close the shape
    // This is not editable by the user
    if (isFirst) {
      const lastIndex = newFeatures[indexes[0]].geometry.coordinates[0].length - 1;
      newFeatures[indexes[0]].geometry.coordinates[0][lastIndex] = target;
    }
    setFeatures(newFeatures);
    setGeonames(undefined, indexes[0]);
  }

  const setGeonames = (geonamesValue: OptionsType | undefined, index: number) => {
    // set the new geonames value
    const newFeatures = [...features];
    newFeatures[index].properties.geoNames = geonamesValue;
    setFeatures(newFeatures);
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
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
            <TableRow hover key={i}>
              <TableCell>
                {
                  feature.geometry.type === "Point" 
                  ? <PlaceIcon />
                  : feature.geometry.type === "LineString" 
                  ? <PolylineIcon />
                  : feature.geometry.type === "Polygon"
                  ? <PentagonIcon />
                  : null
                }
              </TableCell>
              <TableCell>
                {
                  feature.geometry.type === "Point" && 
                  <Stack spacing={1} direction="row">
                    {feature.geometry.coordinates.map((coord: number, j: number) =>
                      <TextField 
                        type="number"
                        key={j} 
                        size="small" 
                        value={coord} 
                        label={i === 1 ? t("lat") : t("lon")} 
                        onChange={(e) => setCoordinates(e.target.value, [i, j])}
                      />
                    )}
                  </Stack>
                }
                { 
                  feature.geometry.type === "LineString" &&
                  feature.geometry.coordinates.map((coord: number[], j:number) =>
                    <Stack spacing={1} direction="row" mb={1} key={j}>
                      {coord.map((c, k) => 
                        <TextField 
                          type="number"
                          size="small" 
                          value={c} 
                          key={k}
                          label={j === 1 ? t("lat") : t("lon")}
                          onChange={(e) => setCoordinates(e.target.value, [i, j, k])}
                        />
                      )}
                    </Stack>
                  )
                }
                {
                  feature.geometry.type === "Polygon" &&
                  feature.geometry.coordinates[0].map((coord: number[], j: number) =>
                    <Stack spacing={1} direction="row" mb={1} key={j}>
                      {coord.map((c, k) => 
                        <TextField 
                          disabled={j === feature.geometry.coordinates[0].length - 1}
                          type="number"
                          size="small" 
                          value={c} 
                          key={k}
                          label={j === 1 ? t("lat") : t("lon")}
                          onChange={(e) => setCoordinates(e.target.value, [i, 0, j, k], j === 0)}
                        />
                      )}
                    </Stack>
                  )
                }
              </TableCell>
              <TableCell>
                <ReverseLookupGeonamesField 
                  setValue={setGeonames}
                  value={feature.properties?.geoNames}
                  featureIndex={i}
                  lat={
                    feature.geometry.type === "Point" ?
                    feature.geometry.coordinates[1] :
                    feature.geometry.type === "LineString" ?
                    feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)][1] :
                    feature.geometry.coordinates[0][Math.floor(feature.geometry.coordinates[0].length / 2)][1]
                  } 
                  lng={
                    feature.geometry.type === "Point" ?
                    feature.geometry.coordinates["0"] :
                    feature.geometry.type === "LineString" ?
                    feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)][0] :
                    feature.geometry.coordinates[0][Math.floor(feature.geometry.coordinates[0].length / 2)][0]
                  } 
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


const controls = ["simple_select", "draw_point", "draw_line_string", "draw_polygon"];

interface Feature {
  id: string;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  properties: {
    geoNames?: OptionsType;
  }
}

type FeaturesEvent = {features: Feature[], action?: string};

const DrawControls = ({ features, setFeatures }: {
  features: Feature[];
  setFeatures: Dispatch<SetStateAction<Feature[]>>;
}) => {
  const { t } = useTranslation("metadata");
  const [ selectedMode, setSelectedMode ] = useState(controls[0]);

  const onUpdate = useCallback((e: FeaturesEvent) => {
    console.log('update called')

    // Clear 'properties' key for each feature in the new array
    // So geonames reference is removed when points change
    const updatedFeatures = e.features.map(feature => ({
      ...feature,
      properties: {},
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
      <List
        subheader={
          <ListSubheader component="div" sx={{ display: 'flex' , alignItems: 'center'}}>
            {t('draw')}
            <Tooltip title={
              <Trans
                i18nKey={`map:drawExplanation`}
                components={[
                  <Typography gutterBottom variant="body2" />,
                ]}
              />
            }>
              <InfoRoundedIcon color="neutral" fontSize="small" sx={{ml: 1}} />
            </Tooltip>
          </ListSubheader>
      }>
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
      />
    </Paper>
  )
}

type DrawControlProps = {
  onCreate: (e: FeaturesEvent) => void;
  onUpdate: (e: FeaturesEvent) => void;
  onDelete: (e: FeaturesEvent) => void;
  mode: string;
  onKeyDown: (e: KeyboardEvent, c: MapboxDraw) => void;
  features: Feature[];
};

// Some MapboxDraw typescript issues, changed to any type for now

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  mode,
  onKeyDown,
  features,
}: DrawControlProps) => {
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
    if (control && features.length > 0) {
      features.map(f => control.add(f))
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
  value: OptionsType | null;
  setValue: (option: OptionsType | null, index: number) => void;
  disabled?: boolean;
}) => {
  // geonames info, where to save
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