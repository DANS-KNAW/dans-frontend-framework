import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

const initialState: {
  activeStep: number;
  ror: any;
  narcis: any;
  depositType: any;
  fileType: any;
  repo: any;
} = {
  activeStep: 0,
  ror: undefined,
  narcis: undefined,
  depositType: undefined,
  fileType: undefined,
  repo: undefined,
};

export const repoAdvisorSlice = createSlice({
  name: "repoAdvisor",
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setRor: (state, action: PayloadAction<any>) => {
      state.ror = action.payload;
    },
    setNarcis: (state, action: PayloadAction<any>) => {
      state.narcis = action.payload;
    },
    setDepositType: (state, action: PayloadAction<any>) => {
      state.depositType = action.payload;
    },
    setFileType: (state, action: PayloadAction<any>) => {
      state.fileType = action.payload;
    },
    setRepo: (state, action: PayloadAction<any>) => {
      state.repo = action.payload;
    }
  },
});

export const { setActiveStep, setRor, setNarcis, setFileType, setDepositType, setRepo } = repoAdvisorSlice.actions;

export const getActiveStep = (state: RootState) => state.repoAdvisor.activeStep;
export const getRor = (state: RootState) => state.repoAdvisor.ror;
export const getNarcis = (state: RootState) => state.repoAdvisor.narcis;
export const getDepositType = (state: RootState) => state.repoAdvisor.depositType;
export const getFileType = (state: RootState) => state.repoAdvisor.fileType;
export const getRepo = (state: RootState) => state.repoAdvisor.repo;

export default repoAdvisorSlice.reducer;
