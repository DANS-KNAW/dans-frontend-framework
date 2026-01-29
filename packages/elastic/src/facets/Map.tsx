import { useCallback, useMemo, useRef } from "react";
import { useSearch } from "@elastic/react-search-ui";
import { type FilterValue } from "@elastic/search-ui";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import geohash from 'ngeohash';
import 'maplibre-gl/dist/maplibre-gl.css';
import Box from "@mui/material/Box";
import type { FeatureCollection, Feature, Point } from "geojson";

interface GeoFilter {
  top_left: { lat: number; lon: number };
  bottom_right: { lat: number; lon: number };
}

export default function GeoMapFacet({ field }: { field: string; }) {
  const { rawResponse, filters: currentFilters, removeFilter, addFilter } = useSearch();
  const mapRef = useRef<MapRef>(null);
  const isProgrammaticMove = useRef(false);
  
  // Get geo aggregation from rawResponse
  const geoAggregation = rawResponse?.aggregations?.facet_bucket_all?.[field];
  
  // Get existing geo filter
  const geoFilter: GeoFilter | undefined = useMemo(() => {
    const filters = currentFilters || [];
    const geoFilterObj = filters.find(f => f.field === field);
    const value = geoFilterObj?.values?.[0];

    // Type guard: ensure value has top_left & bottom_right
    if (
      value &&
      typeof value === "object" &&
      "top_left" in value &&
      "bottom_right" in value
    ) {
      return value as GeoFilter;
    }

    return undefined;
  }, [currentFilters]);

  const geoFilterBounds: [[number, number], [number, number]] = geoFilter ? [
    [geoFilter?.top_left.lon, geoFilter?.bottom_right.lat], // southwest
    [geoFilter?.bottom_right.lon, geoFilter?.top_left.lat]  // northeast
  ] :  [[-180, -25], [180, 60]];

  const geojson: FeatureCollection<Point> = useMemo(() => {
    if (!geoAggregation?.buckets?.length) {
      return {
        type: "FeatureCollection",
        features: []
      };
    }

    const features: Feature<Point>[] = geoAggregation.buckets.map((bucket: any) => {
      const { latitude, longitude } = geohash.decode(bucket.key);

      return {
        type: "Feature",
        properties: {
          geohash: bucket.key,
          count: bucket.doc_count
        },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      };
    });

    return {
      type: "FeatureCollection",
      features
    };
  }, [geoAggregation]);

  const onMoveEnd = useCallback((evt: any) => {
    // Ignore programmatic moves
    if (isProgrammaticMove.current) {
      return;
    }

    const bounds = evt.target.getBounds();

    let north = Math.min(bounds.getNorth(), 90);
    let south = Math.max(bounds.getSouth(), -90);
    let west = Math.max(bounds.getWest(), -180);
    let east = Math.min(bounds.getEast(), 180);

    // Ensure bbox is valid
    if (north < south || east < west) {
      removeFilter(field);
      return;
    }

    // Prevent filtering if zoomed out too far
    if (evt.target.getZoom() < 3) {
      removeFilter(field);
      return;
    }

    const newFilter = {
      top_left: { lat: north, lon: west },
      bottom_right: { lat: south, lon: east }
    };

    // Only update if filter actually changed (with tolerance for floating point)
    const hasChanged = !geoFilter || 
      Math.abs(geoFilter.top_left.lat - north) > 0.01 ||
      Math.abs(geoFilter.top_left.lon - west) > 0.01 ||
      Math.abs(geoFilter.bottom_right.lat - south) > 0.01 ||
      Math.abs(geoFilter.bottom_right.lon - east) > 0.01;

    if (hasChanged) {
      removeFilter(field);
      addFilter(
        field,
        newFilter as unknown as FilterValue,
        "all"
      );
    }
  }, [removeFilter, addFilter, geoFilter]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Map
        ref={mapRef}
        mapLib={import("maplibre-gl")}
        initialViewState={{
          bounds: geoFilterBounds,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onMoveEnd={onMoveEnd}
      >
        {geojson.features.length > 0 && (
          <Source
            id="geohash-points"
            type="geojson"
            data={geojson}
          >
            <Layer
              id="geohash-circles"
              type="circle"
              paint={{
                "circle-color": "#1978c8",
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "count"],
                  1, 10,
                  10, 20,
                  50, 30,
                  100, 40
                ],
                "circle-opacity": 0.7,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff"
              }}
            />
            <Layer
              id="geohash-labels"
              type="symbol"
              layout={{
                "text-field": ["to-string", ["get", "count"]],
                "text-size": 12
              }}
              paint={{
                "text-color": "#fff"
              }}
            />
          </Source>
        )}
      </Map>
    </Box>
  );
}