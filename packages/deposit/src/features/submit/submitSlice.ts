import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import type {
  ReduxFileSubmitActions,
  SubmittedFile,
  SubmitStatus,
  InitialStateType,
} from "../../types/Submit";

const initialState: InitialStateType = {
  metadataStatus: "",
  submittedFiles: [],
  latestSave: "",
};

export const submitSlice = createSlice({
  name: "submit",
  initialState,
  reducers: {
    setMetadataSubmitStatus: (state, action: PayloadAction<SubmitStatus>) => {
      state.metadataStatus = action.payload;
    },
    setLatestSave: (state, action: PayloadAction<string>) => {
      state.latestSave = action.payload;
    },
    setFilesSubmitStatus: (
      state,
      action: PayloadAction<ReduxFileSubmitActions>,
    ) => {
      const { id, progress, status } = action.payload;
      const file = state.submittedFiles.find(
        (file: SubmittedFile) => file.id === id,
      );
      if (file) {
        // file already in state, let's update it
        file.progress = progress ? progress : file.progress;
        file.status = status ? status : file.status;
      } else {
        // otherwise add it
        state.submittedFiles.push({
          id: id,
          progress: progress as number,
          status: status as SubmitStatus,
        });
      }
    },
    resetFilesSubmitStatus: (state) => {
      state["submittedFiles"] = initialState.submittedFiles;
    },
    resetMetadataSubmitStatus: (state) => {
      state["metadataStatus"] = initialState.metadataStatus;
    },
  },
});

export const {
  setMetadataSubmitStatus,
  setFilesSubmitStatus,
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
  setLatestSave,
} = submitSlice.actions;

// Select values from state
export const getMetadataSubmitStatus = (state: RootState) =>
  state.submit.metadataStatus;
export const getLatestSave = (state: RootState) => state.submit.latestSave;
export const getFilesSubmitStatus = (state: RootState) =>
  state.submit.submittedFiles;
export const getSingleFileSubmitStatus = (id: string) => (state: RootState) =>
  state.submit.submittedFiles.find((file: SubmittedFile) => file.id === id);

export default submitSlice.reducer;
