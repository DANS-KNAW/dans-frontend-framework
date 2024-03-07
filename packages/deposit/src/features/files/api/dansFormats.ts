import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  DansSimpleList,
  DansFilesResponse,
  DansGroupedList,
} from "../../../types/Files";

export const dansFormatsApi = createApi({
  reducerPath: "dansFormats",
  baseQuery: fetchBaseQuery({ baseUrl: "https://type.labs.dans.knaw.nl" }),
  endpoints: (build) => ({
    fetchDansFormats: build.query({
      query: () => ({
        url: `dans-formats`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: DansFilesResponse[]) => {
        // transform this list for use in a MUI dropdown
        return response.length > 0
          ? {
              response: response
                .map((item) =>
                  item.format.map((format) => ({
                    label: `${format["file-extension"]} (${format[
                      "mime-type"
                    ].join(", ")})`,
                    value: format["file-extension"],
                    header: item.description.reduce(
                      (obj, { lang, title }) => ({ ...obj, [lang]: title }),
                      {},
                    ),
                  })),
                )
                .flat(),
            }
          : [];
      },
    }),
    fetchSimpleList: build.query({
      query: () => ({
        url: `type-list-simple`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: DansSimpleList) => {
        return response.list;
      },
    }),
    fetchGroupedList: build.query({
      query: () => ({
        url: `type-list-grouped`,
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: DansGroupedList) => {
        return response.type;
      },
    }),
  }),
});

export const {
  useFetchDansFormatsQuery,
  useFetchSimpleListQuery,
  useFetchGroupedListQuery,
} = dansFormatsApi;
