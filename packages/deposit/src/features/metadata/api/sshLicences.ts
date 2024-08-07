import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SshLicenceResponse } from "../../../types/Api";
import i18n from "../../../languages/i18n";

export const sshLicenceApi = createApi({
  reducerPath: "sshLicences",
  baseQuery: fetchBaseQuery({ baseUrl: "https://ssh.datastations.nl/api" }),
  endpoints: (build) => ({
    fetchSshLicences: build.query({
      query: () => "licenses",
      transformResponse: (response: SshLicenceResponse) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        // Order alphabetically
        return response.data?.length > 0 ?
            {
              response: response.data.map((d) => ({
                label: d.name,
                value: d.uri,
              })).sort((a, b) => 
                a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 
                a.label.toLowerCase() > b.label.toLowerCase() ? 1 : 0
              )
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "DANS Licence types" }),
      }),
    }),
  }),
});

export const { useFetchSshLicencesQuery } = sshLicenceApi;
