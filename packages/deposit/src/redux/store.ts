import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import metadataReducer from '../features/metadata/metadataSlice';
import filesReducer from '../features/files/filesSlice';
import submitReducer from '../features/submit/submitSlice';
import depositReducer from '../deposit/depositSlice';
import { orcidApi } from '../features/metadata/api/orcid';
import { rorApi } from '../features/metadata/api/ror';
import { gettyApi } from '../features/metadata/api/getty';
import { geonamesApi } from '../features/metadata/api/geonames';
import { sheetsApi } from '../features/metadata/api/sheets';
import { datastationsApi } from '../features/metadata/api/datastations';
import { submitApi } from '../features/submit/submitApi';
import { dansFormatsApi } from '../features/files/api/dansFormats';
import { dansUtilityApi } from '../features/files/api/dansUtility';
import { errorLogger } from '@dans-framework/utils/error';
import { gorcApi } from '../features/metadata/api/gorc';
import { licenceApi } from '../features/metadata/api/licenses';
import { rdaWorkingGroupsApi } from '../features/metadata/api/rdaWorkgroup';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    files: filesReducer,
    [orcidApi.reducerPath]: orcidApi.reducer,
    [rorApi.reducerPath]: rorApi.reducer,
    [gorcApi.reducerPath]: gorcApi.reducer,
    [licenceApi.reducerPath]: licenceApi.reducer,
    [gettyApi.reducerPath]: gettyApi.reducer,
    [geonamesApi.reducerPath]: geonamesApi.reducer,
    [sheetsApi.reducerPath]: sheetsApi.reducer,
    [submitApi.reducerPath]: submitApi.reducer,
    [datastationsApi.reducerPath]: datastationsApi.reducer,
    [dansFormatsApi.reducerPath]: dansFormatsApi.reducer,
    [dansUtilityApi.reducerPath]: dansUtilityApi.reducer,
    [rdaWorkingGroupsApi.reducerPath]: rdaWorkingGroupsApi.reducer,
    submit: submitReducer,
    deposit: depositReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(orcidApi.middleware)
      .concat(rorApi.middleware)
      .concat(gorcApi.middleware)
      .concat(licenceApi.middleware)
      .concat(gettyApi.middleware)
      .concat(geonamesApi.middleware)
      .concat(sheetsApi.middleware)
      .concat(datastationsApi.middleware)
      .concat(submitApi.middleware)
      .concat(dansFormatsApi.middleware)
      .concat(dansUtilityApi.middleware)
      .concat(rdaWorkingGroupsApi.middleware)
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
