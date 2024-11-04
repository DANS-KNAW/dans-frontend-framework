import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import metadataReducer from "../features/metadata/metadataSlice";
import filesReducer from "../features/files/filesSlice";
import submitReducer from "../features/submit/submitSlice";
import depositReducer from "../deposit/depositSlice";
import { orcidApi } from "../features/metadata/api/orcid";
import { rorApi } from "../features/metadata/api/ror";
import { gettyApi } from "../features/metadata/api/getty";
import { geonamesApi } from "../features/metadata/api/geonames";
import { sheetsApi } from "../features/metadata/api/sheets";
import { datastationsApi } from "../features/metadata/api/datastations";
import { languagesApi } from "../features/metadata/api/languages";
import { submitApi } from "../features/submit/submitApi";
import { dansFormatsApi } from "../features/files/api/dansFormats";
import { dansUtilityApi } from "../features/files/api/dansUtility";
import { errorLogger } from "@dans-framework/utils/error";
import { licenceApi } from "../features/metadata/api/licences";
import { sshLicenceApi } from "../features/metadata/api/sshLicences";
import { maptilerApi } from "../features/metadata/api/maptiler";
import { rdaApi } from "../features/metadata/api/rdaApi";
import { wmsApi } from "../features/metadata/api/wms";
import { validateKeyApi } from "@dans-framework/user-auth";

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    files: filesReducer,
    [orcidApi.reducerPath]: orcidApi.reducer,
    [rorApi.reducerPath]: rorApi.reducer,
    [licenceApi.reducerPath]: licenceApi.reducer,
    [sshLicenceApi.reducerPath]: sshLicenceApi.reducer,
    [gettyApi.reducerPath]: gettyApi.reducer,
    [geonamesApi.reducerPath]: geonamesApi.reducer,
    [sheetsApi.reducerPath]: sheetsApi.reducer,
    [submitApi.reducerPath]: submitApi.reducer,
    [datastationsApi.reducerPath]: datastationsApi.reducer,
    [dansFormatsApi.reducerPath]: dansFormatsApi.reducer,
    [dansUtilityApi.reducerPath]: dansUtilityApi.reducer,
    [rdaApi.reducerPath]: rdaApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [validateKeyApi.reducerPath]: validateKeyApi.reducer,
    [maptilerApi.reducerPath]: maptilerApi.reducer,
    [wmsApi.reducerPath]: wmsApi.reducer,
    submit: submitReducer,
    deposit: depositReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(orcidApi.middleware)
      .concat(rorApi.middleware)
      .concat(licenceApi.middleware)
      .concat(sshLicenceApi.middleware)
      .concat(gettyApi.middleware)
      .concat(geonamesApi.middleware)
      .concat(sheetsApi.middleware)
      .concat(datastationsApi.middleware)
      .concat(submitApi.middleware)
      .concat(dansFormatsApi.middleware)
      .concat(dansUtilityApi.middleware)
      .concat(rdaApi.middleware)
      .concat(languagesApi.middleware)
      .concat(validateKeyApi.middleware)
      .concat(maptilerApi.middleware)
      .concat(wmsApi.middleware)
      .concat(errorLogger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
