import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import i18n from "../../../languages/i18n";
import type { BiodiversityResponse } from "../../../types/Api";

export const biodiversityApi = createApi({
  reducerPath: "biodiversity",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.biodiversitydata.nl/v2" }),
  endpoints: (build) => ({
    fetchSpecies: build.query({
      query: (keyword) => {
        // Format a query to search both for scientific as well as more common matches
        const formattedQuery = encodeURIComponent(JSON.stringify({
          conditions: [
            {
               field: "acceptedName.fullScientificName",
               operator: "CONTAINS",
               value: keyword,
            },
            {
               field: "vernacularNames.name",
               operator: "CONTAINS",
               value: keyword,
            },
          ],
          logicalOperator: "OR",
          size: 1000,
        }));

        return ({
          url: `taxon/query/?_querySpec=${formattedQuery}`,
          headers: { Accept: "application/json" },
        })
      },
      transformResponse: (response: BiodiversityResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        // Otherwise, format the set of results to something useful
        // Todo: language
        console.log(response)
        return response.resultSet?.length > 0 ?
            {
              arg: arg,
              response: response.resultSet.map((result) => ({
                label: result.item.acceptedName.fullScientificName,
                value: result.item.recordURI,
                extraLabel: "vernacularName",
                extraContent: result.item.vernacularNames?.filter(item => item.language === "English" || item.language === "Dutch").map(item => item.name).join(", "),
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "biodiversity" }),
      }),
    }),
  }),
});

export const { useFetchSpeciesQuery } = biodiversityApi;
