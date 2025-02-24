import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import type { FormConfig } from "../types/Metadata";

// Save the props/config we need to redux store, for use in subcomponents
// Also set a global disabled key, for when form is submitting/saving
const initialState: {
  config: FormConfig
  formDisabled: boolean;
  panel: string;
  tab: number;
  touched: boolean;
} = {
  config: {
    targetCredentials: [],
    formTitle: "",
    target: {},
    submitKey: "",
    skipValidation: false,
    filesUpload: {},
  },
  formDisabled: false,
  panel: "",
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

export const { setData, setFormDisabled, setOpenPanel, setOpenTab } = depositSlice.actions;

// Selectors
export const getData = (state: RootState) => state.deposit.config;
export const getFormDisabled = (state: RootState) => state.deposit.formDisabled;
export const getOpenPanel = (state: RootState) => state.deposit.panel;
export const getOpenTab = (state: RootState) => state.deposit.tab;

export default depositSlice.reducer;
