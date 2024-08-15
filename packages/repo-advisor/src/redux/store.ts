import { configureStore } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";
import repoAdvisorReducer from "../features/repoAdvisorSlice";
import { repoAdvisorApi } from "../features/repoAdvisorApi";
import { datastationsApi, rorApi } from "@dans-framework/deposit";

export const store = configureStore({
  reducer: {
    repoAdvisor: repoAdvisorReducer,
    [repoAdvisorApi.reducerPath]: repoAdvisorApi.reducer,
    [datastationsApi.reducerPath]: datastationsApi.reducer,
    [rorApi.reducerPath]: rorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(repoAdvisorApi.middleware)
      .concat(datastationsApi.middleware)
      .concat(rorApi.middleware)
      .concat(errorLogger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
