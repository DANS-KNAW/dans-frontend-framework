import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { SelectedFile, ReduxFileActions } from "../../types/Files";

const initialState: SelectedFile[] = [];

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // keep track of file selection
    addFiles: (state, action: PayloadAction<SelectedFile[]>) => {
      console.log("adding");
      console.log(action);
      state.push(...action.payload);
    },
    removeFile: (state, action: PayloadAction<SelectedFile>) => {
      return state.filter(
        (file: SelectedFile) => file.id !== action.payload.id,
      );
    },
    setFileMeta: (state, action: PayloadAction<ReduxFileActions>) => {
      console.log(action);
      // set extra metadata for this file: restricted status, role, processing, validity
      const file = state.find(
        (file: SelectedFile) => file.id === action.payload.id,
      );
      if (file) {
        file[action.payload.type] = action.payload.value;
      }
    },
    resetFiles: () => initialState,
  },
});

export const { addFiles, removeFile, setFileMeta, resetFiles } =
  filesSlice.actions;

// Select values from state
export const getFiles = (state: RootState) => state.files as SelectedFile[];

export default filesSlice.reducer;
