import { configureStore } from '@reduxjs/toolkit';
import { userApi, userSubmissionsApi, validateKeyApi } from '../user/userApi';
import { errorLogger } from '@dans-framework/utils';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [validateKeyApi.reducerPath]: validateKeyApi.reducer,
    [userSubmissionsApi.reducerPath]: userSubmissionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(userApi.middleware)
    .concat(userSubmissionsApi.middleware)
    .concat(validateKeyApi.middleware)
});

export const initUserProfile = ({provider, id}: {provider: string, id: string}) => 
  store.dispatch(userApi.endpoints.fetchUserProfile.initiate({provider: provider, id: id}));
export const fetchUserProfile = ({provider, id}: {provider: string, id: string}) => 
  userApi.endpoints.fetchUserProfile.select({provider: provider, id: id})(store.getState());

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;