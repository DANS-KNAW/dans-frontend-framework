import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MaptilerCoordinateSystemResponse, MaptilerConversionResponse } from "../../../types/Api";
import i18n from "../../../languages/i18n";

// helper function to convert geojson coordinates to maptiler input
function geojsonToString(type: string, coordinates: number[] | number[][] | number[][][]) {
  switch (type) {
    case 'Point':
      return `${coordinates[0]},${coordinates[1]}`;

    case 'LineString':
      return (coordinates as number[][]).map(coord => `${coord[0]},${coord[1]}`).join(';');

    case 'Polygon':
      // For polygons, we join each ring with ';' and join coordinates within each ring with ' '
      return (coordinates as number[][][])
        .map(ring => ring.map(coord => `${coord[0]},${coord[1]}`).join(';'))
        .join(';');

    default:
      throw new Error('Unsupported GeoJSON type');
  }
}

// converts maptiler response back to geojson
function convertToGeojsonCoordinates(coordinatesArray: {x: number, y: number}[], type: string) {
  // Map through the array to get the [x, y] coordinates.
  const coordinates = coordinatesArray.map(({ x, y }) => [x, y]);

  switch (type) {
    case 'Point':
      if (coordinates.length !== 1) {
        throw new Error('A Point must have exactly one coordinate pair.');
      }
      return coordinates[0];

    case 'LineString':
      return coordinates;

    case 'Polygon':
      return [coordinates];

    default:
      throw new Error('Unsupported GeoJSON type');
  }
}

export const maptilerApi = createApi({
  reducerPath: "maptiler",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.maptiler.com" }),
  endpoints: (build) => ({
    fetchCoordinateSystems: build.query({
      query: (value) => ({
        url: `coordinates/search/${value} kind:*.json?key=${
          import.meta.env.VITE_MAPTILER_API_KEY
        }`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: MaptilerCoordinateSystemResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        // Remove items that don't have a transformations property, as they are no use in converting coordinates
        return response.results.length > 0 ?
            {
              arg: arg,
              response: response.results.map((item) => item.transformations && ({
                label: `${item.name} (${item.id.authority} ${item.id.code})`,
                value: item.id.code,
                id: `${item.id.authority}-${item.id.code}`,
                // add a bit of space around the bounding box, for features right on the border
                bbox: [[item.bbox[0]-0.2, item.bbox[1]-0.2], [item.bbox[2]+0.2, item.bbox[3]+0.2]],
              })).filter(Boolean),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "maptiler" }),
      }),
    }),
    transformCoordinates: build.query({
      query: ({type, coordinates, to, from}) => {
        const stringCoordinates = geojsonToString(type, coordinates);
        return ({
          url: `coordinates/transform/${stringCoordinates}.json?s_srs=${from}&t_srs=${to}&key=${
            import.meta.env.VITE_MAPTILER_API_KEY
          }`,
          headers: { Accept: "application/json" },
        })
      },
      transformResponse: (response: MaptilerConversionResponse, _meta, arg) => {
        // If there are results, just return the coordinates as an array. We always assume only one set of coordinates is passed along.
        return response.results.length > 0 ?
          convertToGeojsonCoordinates(response.results, arg.type)
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "maptiler" }),
      }),
    }),
  }),
});

export const { useFetchCoordinateSystemsQuery, useTransformCoordinatesQuery, useLazyTransformCoordinatesQuery } = maptilerApi;
