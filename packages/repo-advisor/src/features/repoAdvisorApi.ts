import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUser } from "@dans-framework/utils/user";

export const repoAdvisorApi = createApi({
  reducerPath: "repoAdvisorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://repository-assistant.labs.dansdemo.nl`,
  }),
  endpoints: (build) => ({
    submit: build.mutation({
      query: ({ ror, narcis, depositType, fileType }) => {
        const user = getUser();
        // format headers
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
      transformErrorResponse: () => {
        return ({
          error: "Error connecting to server"
        });
      },
    }),
  }),
});

export const { useSubmitMutation } = repoAdvisorApi;