import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FormAction, UserFormAction } from "../types";

// Save the props/config we need to redux store, for use in subcomponents
// Also set a global disabled key, for when form is submitting/saving
const initialState: UserFormAction = {
  formAction: {
    id: undefined,
    action: undefined,
    actionDone: undefined,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFormAction: (state, action: PayloadAction<FormAction>) => {
      state.formAction = action.payload;
    },
    resetFormActions: (state) => {
      state.formAction = initialState.formAction;
    },
  },
});

export const { setFormAction, resetFormActions } = userSlice.actions;

export const getFormAction = (state: { user: UserFormAction }) => state.user.formAction;

export default userSlice.reducer;
