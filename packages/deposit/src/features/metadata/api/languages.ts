import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import i18n from "../../../languages/i18n";
import type { OptionsType } from "../../../types/MetadataFields"

export const languagesApi = createApi({
  reducerPath: "languages",
  baseQuery: fetchBaseQuery({ baseUrl: "https://packaging.labs.dansdemo.nl/utils/languages" }),
  endpoints: (build) => ({
    fetchLanguages: build.query({
      query: () => ({
        url: "",
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: OptionsType[]) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        // Order alphabetically
        return response.length > 0 ?
            {
              response: response,
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "Languages" }),
      }),
    }),
  }),
});

export const { useFetchLanguagesQuery } = languagesApi;
