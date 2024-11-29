import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import type { SerializedFile, Mapping, FileError, SheetData } from "../types";
import type { FormConfig } from "@dans-framework/deposit";

const initialState: {
  activeStep: number;
  mapping: Mapping;
  file: SerializedFile | undefined;
  savedMap: string;
  form: FormConfig | undefined;
  fileError: string | undefined;
  fileData: SheetData[] | undefined;
} = {
  activeStep: 0,
  mapping: {},
  file: undefined,
  savedMap: "",
  form: undefined,
  fileError: undefined,
  fileData: undefined,
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
    resetMapping: (state) => {
      state.mapping = initialState.mapping;
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
    setFileData: (state, action: PayloadAction<SheetData[]>) => {
      state.fileData = action.payload;
    },
    resetFileData: (state) => {
      state.fileData = initialState.fileData;
    },
    setFileError: (state, action: PayloadAction<FileError | undefined>) => {
      state.fileError = action.payload;
    },
    resetFileError: (state) => {
      state.fileError = initialState.fileError;
    },
    reset: () => initialState,
  },
});

export const {
  setActiveStep,
  setMapping,
  resetMapping,
  setSavedMap,
  setFile,
  saveData,
  setFileData,
  resetFileData,
  setFileError,
  resetFileError,
  reset,
} = fileMapperSlice.actions;

export const getActiveStep = (state: RootState) => state.fileMapper.activeStep;
export const getMapping = (state: RootState) => state.fileMapper.mapping;
export const getSavedMap = (state: RootState) => state.fileMapper.savedMap;
export const getFile = (state: RootState) => state.fileMapper.file;
export const getForm = (state: RootState) => state.fileMapper.form;
export const getFileData = (state: RootState) => state.fileMapper.fileData;
export const getFileError = (state: RootState) => state.fileMapper.fileError;

export default fileMapperSlice.reducer;
