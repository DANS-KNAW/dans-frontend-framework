import { configureStore } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";
import { userApi, userSubmissionsApi, validateKeyApi } from "../user/userApi";
import userReducer, {
  resetFormActions,
  setFormAction,
} from "../user/userSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [validateKeyApi.reducerPath]: validateKeyApi.reducer,
    [userSubmissionsApi.reducerPath]: userSubmissionsApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(userSubmissionsApi.middleware)
      .concat(validateKeyApi.middleware)
      .concat(errorLogger),
});

export const initUserProfile = ({
  provider,
  id,
}: {
  provider: string;
  id: string;
}) =>
  store.dispatch(
    userApi.endpoints.fetchUserProfile.initiate({ provider: provider, id: id }),
  );

export const fetchUserProfile = ({
  provider,
  id,
}: {
  provider: string;
  id: string;
}) =>
  userApi.endpoints.fetchUserProfile.select({ provider: provider, id: id })(
    store.getState(),
  );

export const getFormActions = () => store.getState().user.formAction;
export const clearFormActions = () => store.dispatch(resetFormActions());
export const setFormActions = (action: any) =>
  store.dispatch(setFormAction(action));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
