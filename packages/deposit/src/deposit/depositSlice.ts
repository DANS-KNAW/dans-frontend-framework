import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FormConfig } from "../types/Metadata";

// Save the props/config we need to redux store, for use in subcomponents
// Also set a global disabled key, for when form is submitting/saving
type InitialStateType = {
  config: FormConfig
  formDisabled: boolean;
  panel?: string;
  tab: number;
  touched: boolean;
}

const initialState: InitialStateType = {
  config: {
    targetCredentials: [],
    formTitle: "",
    target: {},
    submitKey: "",
    skipValidation: false,
    filesUpload: {},
  },
  formDisabled: false,
  panel: undefined,
  tab: 0,
  touched: false, 
};

export const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<FormConfig>) => {
      state.config = action.payload;
    },
    setFormDisabled: (state, action: PayloadAction<boolean>) => {
      state.formDisabled = action.payload;
    },
    // keep track of the accordion state
    setOpenPanel: (state, action: PayloadAction<string>) => {
      state.panel = action.payload;
    },
    // keep track of open tab (metadata/files)
    setOpenTab: (state, action: PayloadAction<number>) => {
      state.tab = action.payload;
    },
  },
});

export type DepositState = { deposit: InitialStateType };

export const { setData, setFormDisabled, setOpenPanel, setOpenTab } = depositSlice.actions;

// Selectors
export const getData = (state: DepositState) => state.deposit.config;
export const getFormDisabled = (state: DepositState) => state.deposit.formDisabled;
export const getOpenPanel = (state: DepositState) => state.deposit.panel;
export const getOpenTab = (state: DepositState) => state.deposit.tab;

export default depositSlice.reducer;
