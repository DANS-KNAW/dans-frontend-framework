import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    }),
  }),
});

export const { useFetchRecordQuery } = elasticResultApi;
