import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SshLicenceResponse } from '../../../types/Api';

export const sshLicenceApi = createApi({
  reducerPath: 'sshLicences',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://ssh.datastations.nl/api' }),
  endpoints: (build) => ({
    fetchSshLicences: build.query({
      query: () => 'licenses',
      transformResponse: (response: SshLicenceResponse, meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.data?.length > 0 ? 
        ({
          response: response.data.map( d => ({
            label: d.name,
            value: d.uri,
          })),
        }) : [];
      },
    }),
  }),
});

export const {
  useFetchSshLicencesQuery,
} = sshLicenceApi;