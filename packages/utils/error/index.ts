import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';

/**
 * Log a warning and show a toast!
 */
export const errorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')
    console.log(action)
    // Convert the error to a string, probably is one already, but just in case
    const error = JSON.stringify(action.payload.error || action.payload.data || action.payload);
    enqueueSnackbar(`Error! ${error}`, { variant: 'error' });
  }

  return next(action)
}