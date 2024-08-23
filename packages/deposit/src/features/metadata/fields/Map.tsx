import { useEffect, useState, useCallback } from "react";
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
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import Map, { ScaleControl, NavigationControl, useControl } from "react-map-gl/maplibre";
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
import { useFetchGeonamesFreeTextQuery } from "../api/geonames";
import type { QueryReturnType } from "../../../types/Api";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { useDebounce } from "use-debounce";
import Collapse from '@mui/material/Collapse';
import PublicIcon from '@mui/icons-material/Public';

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
}: any) => {
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

  // move map to selected GeoNames value
  useEffect(() => {
    if (geonamesValue) {
      setViewState({
        longitude: geonamesValue.coordinates![1],
        latitude: geonamesValue.coordinates![0],
        zoom: 10,
      });
      setOpenMap(true);
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
        <Map
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          style={{
            width: '100%', 
            height: 400,
            borderRadius: '5px',
            border: "1px solid rgba(0,0,0,0.23)"
          }}
          mapStyle={`https://api.maptiler.com/maps/landscape/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
        >
          <NavigationControl position="top-left" />
          <ScaleControl />
          <DrawControls />
        </Map>
      </Collapse>
    </Box>
  );
};

export default DrawMap;

const controls = ["simple_select", "draw_point", "draw_line_string", "draw_polygon"];

interface Feature {
  id?: string | number;
}

type FeaturesEvent = {features: Feature[], action?: string};

type FeatureObject = {
  [id: string]: Feature;
}

const DrawControls = () => {
  const { t } = useTranslation("metadata");
  const [ selectedMode, setSelectedMode ] = useState(controls[0]);

  // write this to redux store
  const [ features, setFeatures ] = useState<FeatureObject>();
  console.log(features)

  const onUpdate = useCallback((e: FeaturesEvent) => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        if (f.id) {
          newFeatures[f.id] = f;
        }
      }
      return newFeatures;
    });
    setSelectedMode(controls[0])
  }, []);

  const onDelete = useCallback((e: FeaturesEvent) => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        if (f.id) {
          delete newFeatures[f.id];
        }
      }
      return newFeatures;
    });
    setSelectedMode(controls[0])
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
};

// Some MapboxDraw typescript issues, changed to any type for now

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  mode,
  onKeyDown,
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
    control.changeMode(mode);
  }, [mode])

  return null;
}

const GeonamesApiField = ({
  value,
  setValue,
  disabled,
  label
}: {
  value?: OptionsType;
  setValue: (v: OptionsType) => void;
  disabled: boolean;
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