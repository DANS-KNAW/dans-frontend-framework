import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { RorResponse } from '../../../types/Api';

export const rorApi = createApi({
  reducerPath: 'ror',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.ror.org/' }),
  endpoints: (build) => ({
    fetchRorByName: build.query({
      query: (content) => ({
        url: `organizations?query.advanced=name:${content}*`,
        headers: {Accept: "application/json"},
      }),
      transformResponse: (response: RorResponse, meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.number_of_results > 0 ? 
          ({
            arg: arg,
            response: 
              response.items.map( item => ({
                label: item.name,
                value: item.id, 
                extraLabel: 'country',
                extraContent: item.country.country_name,
              })),
          })
          :
          [];
      },
    }),
  }),
});

export const {
  useFetchRorByNameQuery,
} = rorApi;