import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
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

  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <TextField
          fullWidth
          error={status === "error" && field.touched}
          helperText={status === "error" && field.touched && t("incorrect")}
          variant="outlined"
          label={lookupLanguageString(field.label, i18n.language)}
          required={field.required}
          value={field.value || ""}
          disabled={field.disabled || formDisabled}
          onChange={(e) =>
            dispatch(
              setField({
                sectionIndex: sectionIndex,
                id: field.id,
                value: e.target.value,
              }),
            )
          }
          placeholder={field.placeholder}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StatusIcon
                  status={status}
                  title={lookupLanguageString(field.description, i18n.language)}
                />
              </InputAdornment>
            ),
          }}
          inputProps={{ "data-testid": `${field.name}-${field.id}` }}
        />
      </Stack>
      <Map

        initialViewState={{
          longitude: 4.342779,
          latitude: 52.080738,
          zoom: 8
        }}
        style={{
          width: '100%', 
          height: 400,
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
          <ListSubheader component="div">
            {t('draw')}
          </ListSubheader>
      }>
        {controls.map(control =>
          <ListItem key={control} disablePadding>
            <ListItemButton 
              onClick={() => setSelectedMode(control)}
              selected={control === selectedMode}
            >
              <ListItemIcon>
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
