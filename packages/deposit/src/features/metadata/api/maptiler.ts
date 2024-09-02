import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MaptilerCoordinateSystemResponse } from "../../../types/Api";
import i18n from "../../../languages/i18n";

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
        return response.results.length > 0 ?
            {
              arg: arg,
              response: response.results.map((item) => ({
                label: `${item.name} (${item.id.authority} ${item.id.code})`,
                value: item.id.code,
                id: `${item.id.authority}-${item.id.code}`,
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "Maptiler" }),
      }),
    }),
  }),
});

export const { useFetchCoordinateSystemsQuery } = maptilerApi;
