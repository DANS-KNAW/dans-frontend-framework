import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import type { FormConfig } from "../types/Metadata";

// Save the props/config we need to redux store, for use in subcomponents
// Also set a global disabled key, for when form is submitting/saving
const initialState: {
  config: Omit<FormConfig, "form">;
  formDisabled: boolean;
} = {
  config: {
    targetCredentials: [],
    target: {},
    submitKey: "",
    skipValidation: false,
    geonamesApiKey: "",
    gsheetsApiKey: "",
  },
  formDisabled: false,
};

export const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Omit<FormConfig, "form">>) => {
      state.config = action.payload;
    },
    setFormDisabled: (state, action: PayloadAction<boolean>) => {
      state.formDisabled = action.payload;
    },
  },
});

export const { setData, setFormDisabled } = depositSlice.actions;

// Selectors
export const getData = (state: RootState) => state.deposit.config;
export const getFormDisabled = (state: RootState) => state.deposit.formDisabled;

export default depositSlice.reducer;
