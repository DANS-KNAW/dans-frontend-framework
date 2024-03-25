import { forwardRef, useCallback } from "react";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import {
  enqueueSnackbar,
  SnackbarContent,
  CustomContentProps,
  useSnackbar,
} from "notistack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

/**
 * Log a warning and show a toast!
 */
export const errorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.error("We got a rejected action!");
    console.error(action);
    // Convert the error to a string, probably is one already, but just in case
    const error = JSON.stringify(
      action.payload.error || action.payload,
    ).replaceAll('"', "");
    // Ugly check for not showing snackbar on invalid API key
    if (action.meta.arg.endpointName !== "validateAllKeys" && action.payload.status === 401) {
      enqueueSnackbar(error, { variant: "customError", persist: true });
    }
  }

  return next(action);
};

export const CustomError = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, ...props }, ref) => {
    const { message } = props;
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref}>
        <Alert
          variant="filled"
          severity="error"
          sx={{
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
          onClose={handleDismiss}
        >
          <AlertTitle>Error!</AlertTitle>
          {message}
        </Alert>
      </SnackbarContent>
    );
  },
);

declare module "notistack" {
  interface VariantOverrides {
    customError: true;
  }
}
