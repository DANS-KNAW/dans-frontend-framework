import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const keyCheckApi = createApi({
  reducerPath: 'apiKeys',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (build) => ({
    checkKey: build.query({
      query: ({ url, key }) => {
        return ({
          url: url + key,
        });
      },
      transformResponse: (response: any) => {
        return response.status
      },
    })
  }),
});

export const {
  useCheckKeyQuery,
} = keyCheckApi;