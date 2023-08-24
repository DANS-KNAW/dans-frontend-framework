import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { setNotification } from '../features/notification/notificationSlice';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!')
      console.log(action)
      // Convert the error to a string, probably is one already, but just in case
      const error = JSON.stringify(action.payload.error || action.payload.data || action.payload);
      api.dispatch(setNotification({ message: `Error! ${error}`, type: 'error' }));
    }

    return next(action)
  }