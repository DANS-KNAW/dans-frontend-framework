import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SerializedFile, Mapping, FileError, SheetData } from "../types";
import type { FormConfig } from "@dans-framework/deposit";

type FileMapperStateType = {
  activeStep: number;
  mapping: Mapping;
  file: SerializedFile | undefined;
  savedMap: string;
  form: FormConfig | undefined;
  fileError: string | undefined;
  fileData: SheetData[] | undefined;
};  

const initialState: FileMapperStateType = {
  activeStep: 0,
  mapping: {},
  file: undefined,
  savedMap: "",
  form: undefined,
  fileError: undefined,
  fileData: undefined,
};

export type FileMapperState = { fileMapper: FileMapperStateType };

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

export const getActiveStep = (state: FileMapperState) => state.fileMapper.activeStep;
export const getMapping = (state: FileMapperState) => state.fileMapper.mapping;
export const getSavedMap = (state: FileMapperState) => state.fileMapper.savedMap;
export const getFile = (state: FileMapperState) => state.fileMapper.file;
export const getForm = (state: FileMapperState) => state.fileMapper.form;
export const getFileData = (state: FileMapperState) => state.fileMapper.fileData;
export const getFileError = (state: FileMapperState) => state.fileMapper.fileError;

export default fileMapperSlice.reducer;
