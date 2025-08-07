import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RorResponse } from "../../../types/Api";
import i18n from "../../../languages/i18n";

export const rorApi = createApi({
  reducerPath: "ror",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.ror.org/v2" }),
  endpoints: (build) => ({
    fetchRorByName: build.query({
      query: (content) => ({
        url: `organizations?query.advanced=names.value:${content}*`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: RorResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.number_of_results > 0 ?
            {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.names.filter(name => name.types.indexOf("ror_display") !== -1)[0].value || "Unknown",
                value: item.id,
                extraLabel: "country",
                extraContent: item.locations.map(loc=> loc.geonames_details.country_name).join(", ") || "Unknown",
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "RoR" }),
      }),
    }),
  }),
});

export const { useFetchRorByNameQuery } = rorApi;
