import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUser } from "@dans-framework/utils/user";
import type { RepoResponse } from "../types";

export const repoAdvisorApi = createApi({
  reducerPath: "repoAdvisorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ADVISOR_URL,
  }),
  endpoints: (build) => ({
    fetchData: build.query({
      query: ({ ror, narcis, depositType, fileType }) => {
        const user = getUser();
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        };

        return ({
          url: 'seek-advice',
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            affiliation: ror,
            domain: narcis,
            "deposit-type": depositType,
            ...(fileType && { "file-type": fileType }),
          }),
        });
      },
      transformResponse: (response: RepoResponse) => response.advice,
      transformErrorResponse: () => {
        return ({
          error: "Error connecting to server"
        });
      },
    }),
  }),
});

export const { useFetchDataQuery } = repoAdvisorApi;