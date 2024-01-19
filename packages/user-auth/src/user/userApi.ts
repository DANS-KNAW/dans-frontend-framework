import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { User } from "oidc-client-ts";
import type { SubmissionResponse, AuthKeys } from "../types";
import i18n from "../languages/i18n";
import { enqueueSnackbar } from "notistack";

function getUser(provider: string, id: string) {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${provider}:${id}`);
  if (!oidcStorage) {
    return null;
  }
  return User.fromStorageString(oidcStorage);
}

export const userApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_OIDC_AUTHORITY }),
  tagTypes: ["User"],
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      // Note: may not be needed, could possibly user auth.user. TODO?
      query: (id) => {
        const user = getUser(import.meta.env.VITE_OIDC_AUTHORITY, id);
        const token = user?.access_token;
        return {
          url: "account",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["User"],
    }),
    saveUserData: build.mutation({
      query: ({ id, content }) => {
        const user = getUser(import.meta.env.VITE_OIDC_AUTHORITY, id);
        const token = user?.access_token;
        return {
          url: "account",
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: content,
        };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { queryFulfilled }) {
        await queryFulfilled;
        // on successful save, lets show a Toast
        enqueueSnackbar(i18n.t("keySaved", { ns: "user" }), {
          variant: "success",
        });
      },
    }),
  }),
});

export const userSubmissionsApi = createApi({
  reducerPath: "submissions",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_PACKAGING_TARGET }),
  // Make sure data isn't stale and always contains freshly submitted forms
  keepUnusedDataFor: 0.1,
  endpoints: (build) => ({
    fetchUserSubmissions: build.query({
      query: (userId) => {
        return {
          url: `progress-state/${userId}`,
          headers: {
            Accept: "application/json",
          },
        };
      },
      transformResponse: (response: { assets: SubmissionResponse[] }) => {
        return response.assets;
      },
    }),
  }),
});

const getUrl = (url: string, key: string, type: AuthKeys) =>
  type === "dataverse_api_key"
    ? `${url}`
    : type === "zenodo_api_key"
      ? `${url}?access_token=${key}`
      : url;

// Basic api to check keys. No baseUrl, as this is dynamic, and we don't want a separate API for every possible baseUrl
export const validateKeyApi = createApi({
  reducerPath: "apiKeys",
  baseQuery: fetchBaseQuery(),
  endpoints: (build) => ({
    validateKey: build.query({
      query: ({ url, key, type }) => {
        return {
          url: getUrl(url, key, type),
          ...(type === "dataverse_api_key") && {
            headers: {
              "X-Dataverse-key": key
            }
          }
        };
      },
      transformResponse: (response: { status: string | number }) =>
        response.status,
      // response for setting the error snackbar, but we might not use this..
      transformErrorResponse: () => i18n.t("keyError", { ns: "user" }),
    }),
    validateAllKeys: build.query({
      // this will return all targets that have an invalid API key set
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        console.log(_queryApi)
        const promises = arg.map((t: any) =>
          fetchWithBQ({
            url: getUrl(t.url, t.key, t.type),
            ...(t.type === "dataverse_api_key") && {
              headers: {
                "X-Dataverse-key": t.key
              }
            }
          })
        );
        const result = await Promise.all(promises);
        const error = result.some((r) => r.error);

        return error
          ? { error: result[0].error as FetchBaseQueryError }
          : { data: "OK" };
      },
    }),
  }),
});

export const { useValidateKeyQuery, useValidateAllKeysQuery } = validateKeyApi;

export const { useFetchUserProfileQuery, useSaveUserDataMutation } = userApi;

export const { useFetchUserSubmissionsQuery } = userSubmissionsApi;
