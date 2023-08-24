import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SelectedFile, ReduxFileActions } from '../../types/Files';

const initialState: SelectedFile[] = []

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    // keep track of file selection
    addFiles: (state, action: PayloadAction<SelectedFile[]>) => {
      state.push(...action.payload);
    },
    removeFile: (state, action: PayloadAction<SelectedFile>) => {
      return state.filter((file: SelectedFile) => file.id !== action.payload.id)
    },
    setFileMeta: (state, action: PayloadAction<ReduxFileActions>) => {
      // set extra metadata for this file: restricted status, role, processing, validity
      const file = state.find( (file: SelectedFile) => file.id === action.payload.id);
      if (file) {
        file[action.payload.type] = action.payload.value;
      }
    },
    resetFiles: (state) => {
      return state = initialState;
    }
  }
});

export const { addFiles, removeFile, setFileMeta, resetFiles } = filesSlice.actions;

// Select values from state
export const getFiles = (state: RootState) => state.files;

export default filesSlice.reducer;
