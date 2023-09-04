import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from 'oidc-client-ts';

function getUser(provider: string, id: string) {
    const oidcStorage = sessionStorage.getItem(`oidc.user:${provider}:${id}`)
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage);
}

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchUserProfile: build.query({
      query: ({provider, id}) => {
        const user = getUser(provider, id);
        const token = user?.access_token;
        return ({
          url: `${provider}/account`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      },
      providesTags: ['User'],
    }),
    saveUserData: build.mutation({
      query: ({provider, id, content}) => {
        const user = getUser(provider, id);
        const token = user?.access_token;
        return ({
          url: `${provider}/account`,
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