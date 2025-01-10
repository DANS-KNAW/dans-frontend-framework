import type { MapFacetProps } from ".";
import React from "react";
import { getMapInstance, markerStyle } from "./map-instance";
import OLMap from "ol/Map";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, transformExtent } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { MapFacetFilter } from "../state";
import { MapFacetAction } from "../actions";
import Box from "@mui/material/Box"
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

export function MapView(
  props: MapFacetProps & { dispatch: React.Dispatch<MapFacetAction> },
) {
  const initialZoom = React.useRef(0);
  const [vectorSource, setVectorSource] = React.useState<VectorSource<Feature<Point>>>();
  const [map, setMap] = React.useState<OLMap>();
  const mapRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation("facets");

  React.useEffect(() => {
    if (map != null) return;
    const div = mapRef.current;
    if (!div) return;

    const _map = getMapInstance(div);

    const vectorSource = new VectorSource<Feature<Point>>({
      features: [],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      // @ts-ignore
      style: markerStyle,
    });

    _map.addLayer(vectorLayer);

    // this.popupOverlay = new Overlay({
    // 	element: this.popupEl,
    // 	autoPan: { animation: { duration: 250 } }
    // })
    // map.addOverlay(this.popupOverlay)

    // this.clickInteraction = new Select()
    // this.clickInteraction.on('select', e => {
    // 	if (!e.selected.length) return

    // 	store.dispatch({
    // 		type: AppActions.SetActiveAnnotation,
    // 		payload: {
    // 			id: e.selected[0].get('annotation_id')
    // 		}
    // 	})

    // 	const coordinate =e.selected[0].get('coordinate')
    // 	if (coordinate) this.popupOverlay.setPosition(coordinate)
    // })
    // map.addInteraction(this.clickInteraction)

    // Wrap moveend in rendercomplete to avoid setting the filter
    // when the map is first initialized.
    _map.once("rendercomplete", () => {
      const view = _map.getView();
      initialZoom.current = view.getZoom()!;

      _map.on("moveend", () => {
        const zoom = view.getZoom()!;

        let payload: MapFacetFilter | undefined = undefined;

        // Only set the filter if the zoom is not the initial zoom.
        if (zoom != initialZoom.current) {
          const extent = view.calculateExtent();
          const bounds = transformExtent(extent, "EPSG:3857", "EPSG:4326") as [
            number,
            number,
            number,
            number,
          ];
          payload = { bounds, zoom };

          props.dispatch({
            type: "UPDATE_FACET_FILTER",
            subType: "MAP_FACET_SET_FILTER",
            facetID: props.facet.ID,
            value: payload,
          });
        }
      });
    });

    setVectorSource(vectorSource);
    setMap(_map);

    return () => _map.dispose();
  }, []);

  // When the facet is reset to the initial state,
  // reset the map view (zoom and bounds).
  React.useEffect(() => {
    const view = map?.getView()!;
    if (props.filter == null && view != null) {
      // Reset the zoom to the initial zoom
      view.setZoom(initialZoom.current);

      // Reset the bounds to the full extent
      const bounds = transformExtent(
        [-180, -90, 180, 90],
        "EPSG:4326",
        "EPSG:3857",
      );
      view.fit(bounds);
    }
  }, [props.filter]);

  // Effect for restoring the view (zoom and bounds) of the map
  // when the facet is re-expanded.
  React.useEffect(() => {
    const view = map?.getView();

    if (
      view == null ||
      view.getZoom() == null ||
      props.filter?.zoom == null ||
      props.filter?.bounds == null
    )
      return;

    if (!props.facetState.collapse && props.filter.zoom !== view.getZoom()) {
      view.setZoom(props.filter.zoom);
      view.fit(transformExtent(props.filter.bounds, "EPSG:4326", "EPSG:3857"));
    }
  }, [props.facetState.collapse, props.filter, map]);

  // Draw features (markers) on the map.
  // This effect is mainly used to update features on the map when
  // the facet values change. But also when the map is re-initialized,
  // for example when the user collapses and re-expands the facet.
  React.useEffect(() => {
    if (vectorSource == null || map == null || props.values == null) return;

    const features: Feature<Point>[] = [];
    for (const value of props.values) {
      const coordinate = fromLonLat([value.point[1], value.point[0]]);
      const feat = new Feature({
        geometry: new Point(coordinate),
      });
      feat.set("coordinate", coordinate);
      feat.set("count", value.count);
      features.push(feat);
    }

    vectorSource.clear();
    vectorSource.addFeatures(features);
  }, [props.values, map, vectorSource]);

  return ( 
      <Box 
        ref={mapRef} 
        sx={{ 
          width: '100%', 
          height: '18rem', 
          borderRadius: 1, 
          overflow: 'hidden', 
          border: '1px solid', 
          borderColor: 'neutral.light',
          position: 'relative',
        }} 
        mb={1}
      >
        {(props.values === undefined || props.values.length === 0) &&
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%', 
            position: 'absolute', 
            zIndex: 3, 
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.75)' 
          }}>
            { props.values === undefined ? 
              <CircularProgress /> : 
              <Typography variant="body2" sx={{ color: "neutral.dark" }}>
                {t("noData")}
              </Typography>
            }
          </Box>
        }
      </Box>
  );
}
