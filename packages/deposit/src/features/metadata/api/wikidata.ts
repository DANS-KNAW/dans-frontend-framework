import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WikidataResponse } from "../../../types/Api";
import i18n from "../../../languages/i18n";

/* NB: The Wikidata API does not allow CORS requests, so this API is not usable in the browser!!! */

export const wikidataApi = createApi({
  reducerPath: "wikidata",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.wikidata.org/w",
  }),
  endpoints: (build) => ({
    fetchWikidata: build.query({
      query: (content) => {
        return {
          url: `api.php?action=wbsearchentities&format=json&type=item&language=en&origin=*&search=${content}`,
        };
      },
      transformResponse: (response: WikidataResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response["search-continue"] > 0 ?
            {
              arg: arg,
              response: response["search"].map((item) => ({
                label: item.label,
                value: item.concepturi,
                extraLabel: "Description",
                extraContent: item.description,
                idLabel: "ID",
                id: item.id,
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "wikidata" }),
      }),
    }),
  }),
});

export const { useFetchWikidataQuery } = wikidataApi;
