import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FormAction, UserFormAction } from "../types";

// Save the props/config we need to redux store, for use in subcomponents
// Also set a global disabled key, for when form is submitting/saving
const initialState: UserFormAction = {
  formAction: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFormAction: (state, action: PayloadAction<FormAction>) => {
      state.formAction = action.payload;
    },
    resetFormAction: (state) => {
      console.log('reset it')
      state.formAction = initialState.formAction;
    }
  },
});

export const { setFormAction, resetFormAction } = userSlice.actions;

export default userSlice.reducer;
