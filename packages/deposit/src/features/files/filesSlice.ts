import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
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
    resetFiles: state => state = initialState,
    setSubmittedFiles: (state) => {
      // TODO: set a list of files retrieved from saved metadata. Files can be removed from this list, but nothing else.
      // On submit, form should submit an updated file-metadata, with this list, as well as possibly additional local files.
    },
  }
});

export const { addFiles, removeFile, setFileMeta, resetFiles } = filesSlice.actions;

// Select values from state
export const getFiles = (state: RootState) => state.files as SelectedFile[];

export default filesSlice.reducer;
