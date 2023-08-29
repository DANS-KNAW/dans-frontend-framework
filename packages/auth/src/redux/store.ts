import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authApi } from '../authApi';
import { errorLogger } from '@dans-framework/utils/error';

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

export const initUserProfile = () => store.dispatch(authApi.endpoints.fetchUserProfile.initiate(null));
export const getUserProfile = () => authApi.endpoints.fetchUserProfile.select(null)(store.getState());