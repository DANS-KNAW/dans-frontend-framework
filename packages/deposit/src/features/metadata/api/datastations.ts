import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DatastationsResponse } from "../../../types/Api";
import type { Datastations } from "../../../types/MetadataFields";
import i18n from "../../../languages/i18n";

// map short vocab terms to their API vocab counterparts
const vocabMap: Record<Datastations, string> = {
  elsst: "ELSST_R3",
  narcis: "NARCIS",
  dansCollections: "DansCollections",
  getty: "AATC",
};

export const datastationsApi = createApi({
  reducerPath: "datastations",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://vocabs.datastations.nl/rest/v1/",
  }),
  endpoints: (build) => ({
    fetchDatastationsTerm: build.query({
      query: (content) => ({
        // note that the DANS Collections API has no EN content, so lets always retrieve NL for now
        url: `${vocabMap[content.vocabulary as Datastations]}/search?query=${
          content.query
        }*&unique=true&lang=${
          content.vocabulary === "dansCollections" ? "nl" : content.lang
        }`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: DatastationsResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.results.length > 0 ?
            {
              arg: arg.query,
              response: response.results
                .map((item) =>
                  // dansCollections should only return from the ssh collection.
                  // No API var to use for this it seems, so lets do it the dirty way
                  (
                    arg.vocabulary === "dansCollections" &&
                    !item.localname.startsWith("ssh/")
                  ) ?
                    false
                  : {
                      // Elsst responses come in all caps. Not so nice, so let's change that
                      label:
                        arg.vocabulary === "elsst" ?
                          item.prefLabel.charAt(0).toUpperCase() +
                          item.prefLabel.slice(1).toLowerCase()
                        : item.prefLabel,
                      value: item.uri,
                      id: item.localname,
                    },
                )
                .filter(Boolean),
            }
          : [];
      },
      transformErrorResponse: (_response, _meta, arg) => ({
        error: i18n.t("metadata:apiFetchError", {
          api: arg.vocabulary.toUpperCase(),
        }),
      }),
    }),
  }),
});

export const { useFetchDatastationsTermQuery } = datastationsApi;
