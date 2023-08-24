import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const dansUtilityApi = createApi({
  reducerPath: 'dansUtility',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://facades-formats.labs.dans.knaw.nl' }),
  endpoints: (build) => ({
    checkType: build.query({
      query: (content) => ({
        url: `type/${content}`,
        headers: {Accept: 'application/json'},
      }),
    }),
  }),
});

export const {
  useCheckTypeQuery,
} = dansUtilityApi;