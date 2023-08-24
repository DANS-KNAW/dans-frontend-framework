import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../app/store';
import type { Notification, NotificationState } from '../../types/Notification';

// Basic snackbar. Set open state and contents separately, to ensure proper transitions

const initialState: NotificationState = {
  open: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: uuidv4(),
        ...action.payload,
      }
      return state = {data: notification, open: true};
    },
    closeNotification: (state) => {
      return state = {...state, open: false};
    },
    clearNotification: (state) => {
      return state = initialState;
    }
  },
})

export const { setNotification, closeNotification, clearNotification } = notificationSlice.actions;

// Selectors
export const getNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
