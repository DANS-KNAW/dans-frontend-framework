import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from 'oidc-client-ts';

function getUser() {
    const oidcStorage = sessionStorage.getItem(`oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${import.meta.env.VITE_OIDC_CLIENT_ID}`)
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage);
}

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_OIDC_AUTHORITY }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      query: () => {
        const user = getUser();
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
      query: (content) => {
        const user = getUser();
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
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useSaveUserDataMutation,
} = authApi;