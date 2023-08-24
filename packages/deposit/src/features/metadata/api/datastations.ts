import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { DatastationsResponse } from '../../../types/Api';
import type { Datastations } from '../../../types/Metadata';

// map short vocab terms to their API vocab counterparts
const vocabMap: Record<Datastations, string> = {
  elsst: 'ELSST_R3',
  narcis: 'NARCIS',
};

export const datastationsApi = createApi({
  reducerPath: 'datastations',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://vocabs.datastations.nl/rest/v1/' }),
  endpoints: (build) => ({
    fetchDatastationsTerm: build.query({
      query: (content) => ({
        url: `${vocabMap[content.vocabulary as Datastations]}/search?query=${content.query}*&unique=true&lang=${content.lang}`,
        headers: {Accept: "application/json"},
      }),
      transformResponse: (response: DatastationsResponse, meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.results.length > 0 ? 
          ({
            arg: arg.query,
            response: 
              response.results.map( item => ({
                // Elsst responses come in all caps. Not so nice, so let's change that
                label: arg.vocabulary === 'elsst' ? item.prefLabel.charAt(0).toUpperCase() + item.prefLabel.slice(1).toLowerCase() : item.prefLabel,
                value: item.uri,
                id: item.localname,
              })),
          })
          :
          [];
      },
    }),
  }),
});

export const {
  useFetchDatastationsTermQuery,
} = datastationsApi;