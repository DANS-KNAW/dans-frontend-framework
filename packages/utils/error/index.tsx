import { forwardRef } from 'react';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { enqueueSnackbar, SnackbarContent, CustomContentProps } from 'notistack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/**
 * Log a warning and show a toast!
 */
export const errorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')
    console.log(action)
    // Convert the error to a string, probably is one already, but just in case
    const error = JSON.stringify(action.payload.error || action.payload).replaceAll("\"", "");
    enqueueSnackbar(error, { variant: 'customError' });
  }

  return next(action);
}

export const CustomError = forwardRef<HTMLDivElement, CustomContentProps>((props, ref) => {
  const { message } = props;

  return (
    <SnackbarContent ref={ref}>
      <Alert 
        variant="filled" 
        severity="error"
        sx={{boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)"}}
      >
        <AlertTitle>Error!</AlertTitle>
        {message}
      </Alert>
    </SnackbarContent>
  )
})

declare module 'notistack' {
  interface VariantOverrides {  
    customError: true;
  }
}