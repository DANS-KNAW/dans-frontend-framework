import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

const initialState = {
  activeStep: 0,
  mapping: {},
  file: undefined,
  savedMap: '',
};

export const fileMapperSlice = createSlice({
  name: "fileMapper",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setMapping: (state, action) => {
      state.mapping = action.payload;
    },
    setSavedMap: (state, action) => {
      state.savedMap = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    }
  },
});

export const { setActiveStep, setMapping, setSavedMap, setFile } = fileMapperSlice.actions;

export const getActiveStep = (state: RootState) => state.fileMapper.activeStep;
export const getMapping = (state: RootState) => state.fileMapper.mapping;
export const getSavedMap = (state: RootState) => state.fileMapper.savedMap;
export const getFile = (state: RootState) => state.fileMapper.file;

export default fileMapperSlice.reducer;
