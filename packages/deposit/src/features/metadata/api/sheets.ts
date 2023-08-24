import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { SheetsResponse } from '../../../types/Api';

export const sheetsApi = createApi({
  reducerPath: 'sheets',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets/' }),
  endpoints: (build) => ({
    fetchSheets: build.query({
      query: ({options, apiKey}) => ({
        url: `${options.sheetId}/values/${options.page}?key=${apiKey}`,
        headers: {Accept: "application/json"},
      }),
      transformResponse: (response: SheetsResponse, meta, arg) => {
        // cut off everything above the starting row
        return response.values.length > arg.options.startAtRow ?
          ({
            response: response.values.slice(arg.options.startAtRow).map((value: any) => ({
              label: value[arg.options.labelCol],
              value: value[arg.options.valueCol],
              header: arg.options.headerCol !== undefined && value[arg.options.headerCol],
            }))
          })
          :
          [];
      },
    }),
  }),
});

export const {
  useFetchSheetsQuery,
} = sheetsApi;