import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LicenceResponse } from "../../../types/Api";

export const licenceApi = createApi({
  reducerPath: "licences",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://licenses.opendefinition.org/licenses/groups/all.json",
  }),
  endpoints: (build) => ({
    fetchLicences: build.query({
      query: () => "",
      transformResponse: (response: LicenceResponse) => {
        if (!response) return [];

        const licenceArray = Object.values(response);

        // Return an empty array when no results, which is what the Autocomplete field expects
        return licenceArray.length > 0 ?
            {
              response: licenceArray.map((item) => ({
                label: item.id + " " + item.title,
                value: item.url,
                id: item.id,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchLicencesQuery } = licenceApi;
