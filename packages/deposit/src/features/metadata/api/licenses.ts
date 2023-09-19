import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { LicenceResponse } from '../../../types/Api';

export const licenceApi = createApi({
  reducerPath: 'licenses',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://licenses.opendefinition.org/licenses/groups/all.json' }),
  endpoints: (build) => ({
    fetchLicenses: build.query({
      query: () => '',
      transformResponse: (response: LicenceResponse, meta, arg) => {
        if (!response) return [];

        const licenseArray = Object.values(response);
      
        const filteredResponse = licenseArray.filter((license: any) => {
          return license.id.toLowerCase().includes(arg?.toLowerCase());
        });

        // Return an empty array when no results, which is what the Autocomplete field expects
        return filteredResponse.length > 0 ? ({
          arg: arg,
          response: filteredResponse.map(item => ({
            label: item.id + ' ' + item.title,
            value: item.id, 
            extraLabel: 'url',
            extraContent: item.url,
            idLabel: 'LICENSES ID',
            id: item.id,
          })),
        }) : [];
      },
    }),
  }),
});

export const {
    useFetchLicensesQuery,
} = licenceApi;