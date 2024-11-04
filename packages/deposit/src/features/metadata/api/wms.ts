import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { XMLParser } from "fast-xml-parser";

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
  }),
});

export const { useFetchCapabilitiesQuery } = wmsApi;
