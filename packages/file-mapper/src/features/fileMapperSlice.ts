import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import type { SerializedFile, Mapping } from "../types";
import type { FormConfig } from "@dans-framework/deposit";

const initialState: {
  activeStep: number;
  mapping: Mapping;
  file: SerializedFile | undefined;
  savedMap: string;
  form: FormConfig | undefined;
} = {
  activeStep: 0,
  mapping: {},
  file: undefined,
  savedMap: '',
  form: undefined,
};

export const fileMapperSlice = createSlice({
  name: "fileMapper",
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setMapping: (state, action: PayloadAction<Mapping>) => {
      state.mapping = action.payload;
    },
    setSavedMap: (state, action: PayloadAction<string>) => {
      state.savedMap = action.payload;
    },
    setFile: (state, action: PayloadAction<SerializedFile | undefined>) => {
      state.file = action.payload;
    },
    saveData: (state, action) => {
      state.form = action.payload;
    },
  },
});

export const { setActiveStep, setMapping, setSavedMap, setFile, saveData } = fileMapperSlice.actions;

export const getActiveStep = (state: RootState) => state.fileMapper.activeStep;
export const getMapping = (state: RootState) => state.fileMapper.mapping;
export const getSavedMap = (state: RootState) => state.fileMapper.savedMap;
export const getFile = (state: RootState) => state.fileMapper.file;
export const getForm = (state: RootState) => state.fileMapper.form;

export default fileMapperSlice.reducer;
