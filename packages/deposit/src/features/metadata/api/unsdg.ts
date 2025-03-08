import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { UnsdgResponse } from "../../../types/Api";

export const unsdgApi = createApi({
  reducerPath: "unsdg",
  baseQuery: fetchBaseQuery({ baseUrl: "https://unstats.un.org/" }),
  endpoints: (build) => ({
    fetchUnsdg: build.query({
      query: () => ({
        url: "sdgapi/v1/sdg/Goal/List",
        headers: { Accept: "application/json" },
      }),
      transformResponse: (response: UnsdgResponse[]) => {
        return response.length > 0
          ? {
              response: response.map((item) => ({
                label: item.title,
                value: item.code,
                idLabel: "UNSDG code",
                id: item.code,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchUnsdgQuery } = unsdgApi;