import { useCallback, useMemo } from "react";
import { useSearch } from "@elastic/react-search-ui";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import geohash from 'ngeohash';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function GeoMapFacet() {
  const searchContext = useSearch();
  
  // Get geo aggregation from rawResponse
  const geoAggregation = searchContext.rawResponse?.aggregations?.facet_bucket_all?.["countries.location"];
  
  console.log("Geo aggregation:", geoAggregation);
  console.log("Buckets:", geoAggregation?.buckets);

  const geojson = useMemo(() => {
    if (!geoAggregation?.buckets?.length) {
      console.log("No buckets found");
      return {
        type: "FeatureCollection",
        features: []
      };
    }

    console.log("Processing", geoAggregation.buckets.length, "buckets");

    const features = geoAggregation.buckets.map(bucket => {
      const { latitude, longitude } = geohash.decode(bucket.key);
      console.log(`Decoded ${bucket.key} to lat:${latitude}, lon:${longitude}, count:${bucket.doc_count}`);
      
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

    console.log("Generated features:", features);

    return {
      type: "FeatureCollection",
      features
    };
  }, [geoAggregation]);

  console.log("Final GeoJSON:", geojson);

  const onMoveEnd = useCallback((evt) => {
    const bounds = evt.target.getBounds();

    searchContext.removeFilter("countries.location");

    searchContext.addFilter(
      "countries.location",
      {
        top_left: {
          lat: bounds.getNorth(),
          lon: bounds.getWest()
        },
        bottom_right: {
          lat: bounds.getSouth(),
          lon: bounds.getEast()
        }
      },
      "all"
    );
  }, [searchContext]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{
          latitude: 52.5,
          longitude: 13.4,
          zoom: 4
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
    </div>
  );
}