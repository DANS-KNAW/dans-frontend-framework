import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { GeonamesResponse } from '../../../types/Api';

export const geonamesApi = createApi({
  reducerPath: 'geonames',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://secure.geonames.org/' }),
  endpoints: (build) => ({
    fetchGeonamesFreeText: build.query({
      query: ({value, apiKey}) => ({
        url: `searchJSON?q=${value}&username=${apiKey}`,
        headers: {Accept: "application/json"},
      }),
      transformResponse: (response: GeonamesResponse, meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.totalResultsCount > 0 ? 
          ({
            arg: arg.value,
            response: 
              response.geonames.map( item => ({
                label: `${item.name} (${item.fcodeName}) ${item.countryName ? item.countryName : ''}`,
                value: `https://www.geonames.org/${item.geonameId}`,
                coordinates: [item.lat, item.lng],
              })),
          })
          :
          [];
      },
    }),
  }),
});

export const {
  useFetchGeonamesFreeTextQuery,
} = geonamesApi;