import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authApi } from '../auth/authApi';
import { errorLogger } from '@dans-framework/utils';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(errorLogger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const initUserProfile = ({provider, id}: {provider: string, id: string}) => 
  store.dispatch(authApi.endpoints.fetchUserProfile.initiate({provider: provider, id: id}));
export const fetchUserProfile = ({provider, id}: {provider: string, id: string}) => 
  authApi.endpoints.fetchUserProfile.select({provider: provider, id: id})(store.getState());