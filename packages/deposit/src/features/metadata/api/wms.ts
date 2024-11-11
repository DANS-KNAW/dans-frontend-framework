import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { XMLParser } from "fast-xml-parser";

function createBoundingBox(lngLat, buffer = 0.0001) {
  const { lng, lat } = lngLat;

  const bbox = [
    lng - buffer,
    lat - buffer,
    lng + buffer,
    lat + buffer
  ];

  return bbox.join(',');
}

export const wmsApi = createApi({
  reducerPath: 'wms',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (build) => ({
    fetchCapabilities: build.query({
      query: (content) => {
        return {
          url: `${content}&REQUEST=GetCapabilities`,
          responseHandler: (response) => response.text(),
        };
      },
      transformResponse: (response: string) => {
        const parser = new XMLParser({
          ignoreAttributes: false, // Do not ignore attributes
          parseAttributeValue: true, // Parse attribute values
          trimValues: true,
        });
        const json = parser.parse(response);
        return json.WMS_Capabilities;
      },
    }),
    fetchFeature: build.query({
      // custom query that can handle an array of layers
      queryFn: async ({url, layerName, lngLat}) => {
        const parser = new XMLParser({
          ignoreAttributes: false, // Do not ignore attributes
          parseAttributeValue: true, // Parse attribute values
          trimValues: true,
        });

        const response = await url.map( (val, i) => 
          fetch(`${val}&REQUEST=GetFeatureInfo&dpi=135&map_resolution=135&format_options=dpi%3A256&width=500&height=500&crs=EPSG:4326&query_layers=${layerName[i]}&info_format=application/json&bbox=${createBoundingBox(lngLat)}`)
        );

        const json = parser.parse(response);
        return json;
      },
    }),
  }),
});

export const { useFetchCapabilitiesQuery, useLazyFetchFeatureQuery } = wmsApi;
