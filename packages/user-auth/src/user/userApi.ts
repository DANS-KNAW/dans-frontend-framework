import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from 'oidc-client-ts';
import type { SubmissionResponse, ReleaseVersion, AuthKeys } from '../types';
import i18n from '../languages/i18n';
import { enqueueSnackbar } from 'notistack';

function getUser(provider: string, id: string) {
    const oidcStorage = sessionStorage.getItem(`oidc.user:${provider}:${id}`)
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage);
}

export const userApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_OIDC_AUTHORITY}),
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      // Note: may not be needed, could possibly user auth.user. TODO?
      query: (id) => {
        const user = getUser(import.meta.env.VITE_OIDC_AUTHORITY, id);
        const token = user?.access_token; 
        return ({
          url: 'account',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      },
      providesTags: ['User'],
    }),
    saveUserData: build.mutation({
      query: ({id, content}) => {
        const user = getUser(import.meta.env.VITE_OIDC_AUTHORITY, id);
        const token = user?.access_token;
        return ({
          url: 'account',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: content,
        })
      },
      invalidatesTags: ['User'],
      async onQueryStarted( arg, { dispatch, queryFulfilled } ) {
        await queryFulfilled;
        // on successful save, lets show a Toast
        enqueueSnackbar(i18n.t('keySaved', {ns: 'user'}), { variant: 'success' });
      },
    }),
  }),
});

export const userSubmissionsApi = createApi({
  reducerPath: 'submissions',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_PACKAGING_TARGET }),
  // Make sure data isn't stale and always contains freshly submitted forms
  keepUnusedDataFor: 0.1,
  endpoints: (build) => ({
    fetchUserSubmissions: build.query({
      query: (userId) => {
        return ({
          url: `progress-state/${userId}`,
          headers: {
            Accept: 'application/json',
          },
        });
      },
      transformResponse: (response: SubmissionResponse[]) => {
        return response
      },
    })
  }),
});

// Basic api to check keys. No baseUrl, as this is dynamic, and we don't want a separate API for every possible baseUrl
export const validateKeyApi = createApi({
  reducerPath: 'apiKeys',
  baseQuery: fetchBaseQuery(),
  endpoints: (build) => ({
    validateKey: build.query({
      query: ({ url, key, type }) => {
        const checkUrl = 
          type === 'dataverse_api_key' ?
          `${url}?key=${key}` :
          type === 'zenodo_api_key' ?
          `${url}?access-token=${key}` :
          url
        return ({
          url: checkUrl,
        });
      },
      transformResponse: (response: { status: string | number }) => {
        // set validation in slice
        
        return response.status
      },
      transformErrorResponse: (response: { status: string | number }, meta, arg) => i18n.t('keyError', {ns: 'user'}),
    })
  }),
});

export const {
  useValidateKeyQuery,
} = validateKeyApi;

export const {
  useFetchUserProfileQuery,
  useSaveUserDataMutation,
} = userApi;

export const {
  useFetchUserSubmissionsQuery,
} = userSubmissionsApi;