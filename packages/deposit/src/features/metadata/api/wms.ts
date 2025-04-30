import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { XMLParser } from "fast-xml-parser";

export const wmsApi = createApi({
  reducerPath: "wms",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
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
      query: ({ url, layerName, x, y, bbox, width, height }) => {
        const params = new URLSearchParams({
          request: "GetFeatureInfo",
          dpi: "135",
          map_resolution: "135",
          format_options: "dpi:256",
          width: width,
          height: height,
          crs: "EPSG:3857",
          i: x,
          j: y,
          query_layers: layerName,
          info_format: "application/json",
          bbox: bbox,
        });
        return {
          url: `${url}&${params.toString()}`,
        };
      },
    }),
  }),
});

export const { useFetchCapabilitiesQuery, useLazyFetchFeatureQuery } = wmsApi;
