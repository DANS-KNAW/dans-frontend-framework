import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation, Trans } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { setField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { TextFieldProps } from "../../../types/MetadataProps";
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
import PlaceIcon from '@mui/icons-material/Place';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import PentagonIcon from '@mui/icons-material/Pentagon';
import { useFetchGeonamesFreeTextQuery } from "../api/geonames";
import type { QueryReturnType } from "../../../types/Api";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { useDebounce } from "use-debounce";

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
  const [geonamesValue, setGeonamesValue] = useState<string>("");
  const [viewState, setViewState] = useState({
    longitude: 4.342779,
    latitude: 52.080738,
    zoom: 8,
  });

  // move map to selected GeoNames value
  useEffect(() => {
    geonamesValue && setViewState({
      longitude: geonamesValue.coordinates[1],
      latitude: geonamesValue.coordinates[0],
      zoom: 10,
    });
  }, [geonamesValue])

  return (
    <Box>
      <GeonamesApiField 
        value={geonamesValue}
        setValue={setGeonamesValue}
        disabled={formDisabled || field.disabled}
        label={lookupLanguageString(field.label, i18n.language)}
      />
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
    </Box>
  );
};

export default DrawMap;

const controls = ["simple_select", "draw_point", "draw_line_string", "draw_polygon"];

const DrawControls = () => {
  const { t } = useTranslation("map");
  const [ selectedMode, setSelectedMode ] = useState(controls[0]);

  // move this to redux store
  const [ features, setFeatures ] = useState({});

  console.log(features)

  const onUpdate = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
    setSelectedMode(controls[0])
  }, []);

  const onDelete = useCallback(e => {
    console.log('delete called')
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
    setSelectedMode(controls[0])
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
      </List>
      <DrawControl 
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        mode={selectedMode}
      />
    </Paper>
  )
}

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  mode
}) => {
  const control = useControl<MapboxDraw>(
    () => new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: mode,
      keybindings: true,
    }),
    ({map}: {map: MapRef}) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
    },
    ({map}: {map: MapRef}) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
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
    />
  );
};