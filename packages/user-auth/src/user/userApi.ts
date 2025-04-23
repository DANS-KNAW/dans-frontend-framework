import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SubmissionResponse, AuthKeys } from "../types";
import i18n from "../languages/i18n";
import { enqueueSnackbar } from "notistack";
import { getUser } from "@dans-framework/utils/user";

export const userApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_OIDC_AUTHORITY }),
  tagTypes: ["User"],
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      // Note: may not be needed, could possibly user auth.user. TODO?
      query: () => {
        const user = getUser();
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
      query: ({ content }) => {
        const user = getUser();
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
  tagTypes: ["Submissions"],
  endpoints: (build) => ({
    fetchUserSubmissions: build.query({
      // Note on pagination: api needs to support sorting and filtering for server side pagination to properly work with the MUI Data Grid. Since it doesn't at the moment, we set a very large page size and let the client handle pagination.
      query: ({targetCredentials: targetCredentials, page = 1, pageSize = 1000}) => {
        // We need to pass on endpoint api keys with this call, like submitApi.ts does, 
        // for server to compare data with data on target repo 
        const user = getUser();
        const targets = targetCredentials.map((t: { repo: string; auth: string; authKey: string; }) => ({
          "target-repo-name": t.repo,
          credentials: {
            username: t.auth,
            password: Object.assign(
              {},
              ...targetCredentials.map((t: { authKey: string }) => ({
                [t.authKey]: user?.profile[t.authKey],
              })),
            )[t.authKey],
          },
        }));
        return {
          url: `progress-state/${user?.profile.sub}?page=${page}&page_size=${pageSize}`,
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            Accept: "application/json",
            "assistant-config-name": import.meta.env.VITE_CONFIG_NAME,
            "targets-credentials": JSON.stringify(targets),
          },
        };
      },
      providesTags: ["Submissions"],
      transformResponse: (response: { assets: SubmissionResponse[] }) => {
        return response.assets;
      },
      transformErrorResponse: (response) => {
        console.log(response);
        return { error: i18n.t("fetchFormError", { ns: "user" }) };
      },
    }),
    deleteSubmission: build.mutation({
      query: ({ id }) => {
        const user = getUser();
        return {
          url: `inbox/dataset/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            Accept: "application/json",
            "auth-env-name": import.meta.env.VITE_ENV_NAME,
            "assistant-config-name": import.meta.env.VITE_CONFIG_NAME,
            "user-id": user?.profile.sub,
          },
        };
      },
      invalidatesTags: ["Submissions"],
      transformErrorResponse: (response) => {
        console.log(response);
        return { error: i18n.t("deleteFormError", { ns: "user" }) };
      },
      transformResponse: () => {
        enqueueSnackbar(i18n.t("deleteSuccess", { ns: "user" }), {
          variant: "info",
        });
      },
    }),
  }),
});

const getUrl = (url: string, key: string, type: AuthKeys) =>
  type.includes("dataverse") ? `${url}`
  : type === "zenodo_api_key" ? `${url}?access_token=${key}`
  : url;

// Basic api to check keys. No baseUrl, as this is dynamic, and we don't want a separate API for every possible baseUrl
export const validateKeyApi = createApi({
  reducerPath: "apiKeys",
  baseQuery: fetchBaseQuery(),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    validateKey: build.query({
      query: ({ url, key, type }) => {
        return {
          url: getUrl(url, key, type),
          ...(type.includes("dataverse") && {
            headers: {
              "X-Dataverse-key": key,
            },
          }),
        };
      },
      transformResponse: (response: { status: string | number }) =>
        response.status,
      // response for setting the error snackbar
      transformErrorResponse: (response) => {
        console.log(response);
        // show snackbar only on server fetch error, not for invalid keys
        if (response.status === "FETCH_ERROR") {
          return { error: i18n.t("fetchApiKeyError", { ns: "user" }) };
        }
        return;
      },
    }),
    validateAllKeys: build.query({
      // this will return all targets that have an invalid API key set
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        const promises = arg.map((t: any) =>
          fetchWithBQ({
            url: getUrl(t.url, t.key, t.type),
            ...(t.type.includes("dataverse") && {
              headers: {
                "X-Dataverse-key": t.key,
              },
            }),
          }),
        );
        const result = await Promise.all(promises);
        const error = result.some((r) => r.error);

        return error ?
            { error: result[0].error as FetchBaseQueryError }
          : { data: "OK" };
      },
    }),
  }),
});

export const { useValidateKeyQuery, useValidateAllKeysQuery } = validateKeyApi;

export const { useFetchUserProfileQuery, useSaveUserDataMutation } = userApi;

export const { useFetchUserSubmissionsQuery, useDeleteSubmissionMutation } =
  userSubmissionsApi;
