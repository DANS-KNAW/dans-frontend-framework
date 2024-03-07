import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SavedFormResponse } from "../types/Metadata";

// Function for retrieving saved forms
export const depositApi = createApi({
  reducerPath: "savedDeposit",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/dataset/`,
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    fetchSavedMetadata: build.query({
      query: (id) => ({
        url: id,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: SavedFormResponse) => {
        // mark previously submitted files
        const modifiedResponse = {
          ...response,
          md: {
            ...response.md,
            "file-metadata": response.md["file-metadata"]
              ? response.md["file-metadata"].map((f) => ({
                  ...f,
                  submittedFile: true,
                }))
              : [],
          },
        };
        return modifiedResponse;
      },
    }),
  }),
});

export const { useFetchSavedMetadataQuery } = depositApi;
