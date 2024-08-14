import { configureStore } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";
import fileMapperReducer from "../features/fileMapperSlice";
import { darwinCoreApi, submitMappingApi } from "../features/fileMapperApi";

export const store = configureStore({
  reducer: {
    fileMapper: fileMapperReducer,
    [darwinCoreApi.reducerPath]: darwinCoreApi.reducer,
    [submitMappingApi.reducerPath]: submitMappingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(darwinCoreApi.middleware)
      .concat(submitMappingApi.middleware)
      .concat(errorLogger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
