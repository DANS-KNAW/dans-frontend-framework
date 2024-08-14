import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as XLSX from "xlsx";
import type { DarwinOptions } from "../types";

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
