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
      transformResponse: (response: InitialFormType) => {
        const modifiedResponse = response['file-metadata']!.length > 0 ?
          {...response, ['file-metadata']: response['file-metadata']!.map(f => ({...f, submittedFile: true}))} :
          response;
        return modifiedResponse;
      }
    }),
  }),
});

export const {
  useFetchSavedMetadataQuery,
} = depositApi;