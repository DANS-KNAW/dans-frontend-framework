import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Hide harvester provenance wrappers from the detail page. The fetch contract
// (_source/:id) is unchanged; the guard is purely post-fetch so indices
// without _category are unaffected.
function isInternal(doc: any): boolean {
  const cat = doc?._category;
  if (Array.isArray(cat)) return cat.includes("_internal");
  return cat === "_internal";
}

export const elasticResultApi = createApi({
  reducerPath: "elasticResultApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT}/${import.meta.env.VITE_ELASTICSEARCH_INDEX}/_source/`,
  }),
  endpoints: (build) => ({
    fetchRecord: build.query({
      query: (value) => ({
        url: encodeURIComponent(value),
      }),
      transformResponse: (response: any) =>
        isInternal(response) ? undefined : response,
    }),
  }),
});

export const { useFetchRecordQuery } = elasticResultApi;
