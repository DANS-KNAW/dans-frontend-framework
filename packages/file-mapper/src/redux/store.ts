import { configureStore } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";
import fileMapperReducer from "../features/fileMapperSlice";
import { darwinCoreApi } from "../features/fileMapperApi";

export const store = configureStore({
  reducer: {
    fileMapper: fileMapperReducer,
    [darwinCoreApi.reducerPath]: darwinCoreApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(darwinCoreApi.middleware)
      .concat(errorLogger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
