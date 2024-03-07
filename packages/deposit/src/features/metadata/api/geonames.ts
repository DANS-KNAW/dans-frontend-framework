import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GeonamesResponse } from "../../../types/Api";

export const geonamesApi = createApi({
  reducerPath: "geonames",
  baseQuery: fetchBaseQuery({ baseUrl: "https://secure.geonames.org/" }),
  endpoints: (build) => ({
    fetchGeonamesFreeText: build.query({
      query: (value) => ({
        url: `searchJSON?q=${value}&username=${
          import.meta.env.VITE_GEONAMES_API_KEY
        }`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: GeonamesResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.totalResultsCount > 0
          ? {
              arg: arg,
              response: response.geonames.map((item) => ({
                label: `${item.name} (${item.fcodeName}) ${
                  item.countryName ? item.countryName : ""
                }`,
                value: `https://www.geonames.org/${item.geonameId}`,
                coordinates: [item.lat, item.lng],
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchGeonamesFreeTextQuery } = geonamesApi;
