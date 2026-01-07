import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
  metadataReducer,
  filesReducer,
  submitReducer,
  depositReducer,
  orcidApi,
  rorApi,
  geonamesApi,
  sheetsApi,
  datastationsApi,
  languagesApi,
  submitApi,
  dansFormatsApi,
  dansUtilityApi,
  licenceApi,
  sshLicenceApi,
  maptilerApi,
  rdaApi,
  wmsApi,
  biodiversityApi,
  wikidataApi,
  unsdgApi,
} from "@dans-framework/deposit";
import { errorLogger } from "@dans-framework/utils/error";
import { userApi, userSubmissionsApi, validateKeyApi, userReducer } from "@dans-framework/user-auth";
import { fileMapperReducer, darwinCoreApi, submitMappingApi } from "@dans-framework/file-mapper";
import { repoAdvisorReducer, repoAdvisorApi } from "@dans-framework/repo-advisor";
import { elasticReducer } from "@dans-framework/elastic";


export const store = configureStore({
  reducer: {
    // deposit related reducers
    metadata: metadataReducer,
    files: filesReducer,
    [orcidApi.reducerPath]: orcidApi.reducer,
    [rorApi.reducerPath]: rorApi.reducer,
    [licenceApi.reducerPath]: licenceApi.reducer,
    [sshLicenceApi.reducerPath]: sshLicenceApi.reducer,
    [geonamesApi.reducerPath]: geonamesApi.reducer,
    [sheetsApi.reducerPath]: sheetsApi.reducer,
    [submitApi.reducerPath]: submitApi.reducer,
    [datastationsApi.reducerPath]: datastationsApi.reducer,
    [dansFormatsApi.reducerPath]: dansFormatsApi.reducer,
    [dansUtilityApi.reducerPath]: dansUtilityApi.reducer,
    [rdaApi.reducerPath]: rdaApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [maptilerApi.reducerPath]: maptilerApi.reducer,
    [wmsApi.reducerPath]: wmsApi.reducer,
    [biodiversityApi.reducerPath]: biodiversityApi.reducer,
    [unsdgApi.reducerPath]: unsdgApi.reducer,
    [wikidataApi.reducerPath]: wikidataApi.reducer,
    submit: submitReducer,
    deposit: depositReducer,
    // user-auth related reducers
    [userApi.reducerPath]: userApi.reducer,
    [validateKeyApi.reducerPath]: validateKeyApi.reducer,
    [userSubmissionsApi.reducerPath]: userSubmissionsApi.reducer,
    user: userReducer,
    // file-mapper related reducers
    fileMapper: fileMapperReducer,
    [darwinCoreApi.reducerPath]: darwinCoreApi.reducer,
    [submitMappingApi.reducerPath]: submitMappingApi.reducer,
    // repo-advisor related reducers
    repoAdvisor: repoAdvisorReducer,
    [repoAdvisorApi.reducerPath]: repoAdvisorApi.reducer,
    // elastic related reducers
    elastic: elasticReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // user-auth
      .concat(userApi.middleware)
      .concat(userSubmissionsApi.middleware)
      .concat(validateKeyApi.middleware)
      // file-mapper
      .concat(darwinCoreApi.middleware)
      .concat(submitMappingApi.middleware)
      // repo-advisor
      .concat(repoAdvisorApi.middleware)
      // deposit
      .concat(orcidApi.middleware)
      .concat(rorApi.middleware)
      .concat(licenceApi.middleware)
      .concat(sshLicenceApi.middleware)
      .concat(geonamesApi.middleware)
      .concat(sheetsApi.middleware)
      .concat(datastationsApi.middleware)
      .concat(submitApi.middleware)
      .concat(dansFormatsApi.middleware)
      .concat(dansUtilityApi.middleware)
      .concat(rdaApi.middleware)
      .concat(languagesApi.middleware)
      .concat(maptilerApi.middleware)
      .concat(wmsApi.middleware)
      .concat(biodiversityApi.middleware)
      .concat(unsdgApi.middleware)
      .concat(wikidataApi.middleware)
      // error
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