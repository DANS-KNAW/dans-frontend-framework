import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as XLSX from "xlsx";
import type { DarwinOptions } from "../types";
import { getUser } from "@dans-framework/utils/user";

export const darwinCoreApi = createApi({
  reducerPath: "darwinCoreApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://raw.githubusercontent.com/tdwg/rs.tdwg.org/master" }),
  endpoints: (build) => ({
    fetchDarwinTerms: build.query({
      query: () => ({
        url: "terms/terms.csv",
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (response, _meta, _arg) => {
        // convert xml text string to JSON
        const workbook = XLSX.read(response, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: DarwinOptions[] = XLSX.utils.sheet_to_json(sheet);
        const filteredData = sheetData
          .filter(d => !d.term_deprecated)
          .map(d => ({...d, header: d.tdwgutility_organizedInClass?.split('/').pop() || 'Dataset'}))
          .sort((a, b) => a.header?.localeCompare(b.header));
        return filteredData || [];
      },
      transformErrorResponse: () => ({
        error: "Could not fetch terms",
      }),
    }),
  }),
});

export const { useFetchDarwinTermsQuery } = darwinCoreApi;

export const submitMappingApi = createApi({
  reducerPath: "submitMappingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/mapper/`,
  }),
  endpoints: (build) => ({
    submitMap: build.mutation({
      query: ({ savedMap, newMap, file }) => {
        const user = getUser();
        // format headers
        const headers = {
          Authorization: `Bearer ${user?.access_token}`,
        };

        let formData = new FormData();
        formData.append("file", file);
        formData.append("savedMap", savedMap);
        formData.append("map", JSON.stringify(newMap));

        console.log(`sending data:`)
        console.log(formData.get('file'))
        console.log(formData.get('savedMap'))
        console.log(formData.get('map'))

        return ({
          url: '',
          method: "POST",
          headers: headers,
          body: formData,
        });
      },
      transformErrorResponse: () => {
        return ({
          error: "Error connecting to server"
        });
      },
    }),
  }),
});

export const { useSubmitMapMutation } = submitMappingApi;
