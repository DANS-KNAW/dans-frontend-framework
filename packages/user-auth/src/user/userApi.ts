import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from 'oidc-client-ts';
import type { SubmissionResponse, ReleaseVersion } from '../types';

function getUser(provider: string, id: string) {
    const oidcStorage = sessionStorage.getItem(`oidc.user:${provider}:${id}`)
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage);
}

export const userApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      // Note: may not be needed, could possibly user auth.user, would be great. TODO!
      query: (id) => {
        const user = getUser(import.meta.env.VITE_OIDC_AUTHORITY, id);
        const token = user?.access_token;
        return ({
          url: `${import.meta.env.VITE_OIDC_AUTHORITY}/account`,
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
          url: `${import.meta.env.VITE_OIDC_AUTHORITY}/account`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: content,
        })
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const userSubmissionsApi = createApi({
  reducerPath: 'submissions',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_PACKAGING_TARGET }),
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

export const {
  useFetchUserProfileQuery,
  useSaveUserDataMutation,
} = userApi;

export const {
  useFetchUserSubmissionsQuery,
} = userSubmissionsApi;