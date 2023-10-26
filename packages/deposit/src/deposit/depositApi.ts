import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { InitialFormType } from '../types/Metadata';

// Function for retrieving saved forms
export const depositApi = createApi({
  reducerPath: 'savedDeposit',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/metadata/` }),
  endpoints: (build) => ({
    fetchSavedMetadata: build.query({
      query: (id) => ({
        url: id,
        headers: {Accept: "application/json"},
      }),
    }),
  }),
});

export const {
  useFetchSavedMetadataQuery,
} = depositApi;