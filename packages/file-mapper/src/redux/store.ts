import { configureStore } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";
import fileMapperReducer from "../features/fileMapperSlice";

export const store = configureStore({
  reducer: {
    fileMapper: fileMapperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(errorLogger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
