import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OptionsType, FormConfig } from "@dans-framework/deposit";

type RepoAdvisorStateType = {
  activeStep: number;
  ror: OptionsType | null;
  narcis: OptionsType | null;
  depositType: string;
  fileType: string;
  repo: FormConfig | undefined;
};  

const initialState: RepoAdvisorStateType = {
  activeStep: 0,
  ror: null,
  narcis: null,
  depositType: "",
  fileType: "",
  repo: undefined,
};

export type RepoAdvisorState = { repoAdvisor: RepoAdvisorStateType };

export const repoAdvisorSlice = createSlice({
  name: "repoAdvisor",
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setRor: (state, action: PayloadAction<OptionsType | null>) => {
      state.ror = action.payload;
    },
    setNarcis: (state, action: PayloadAction<OptionsType | null>) => {
      state.narcis = action.payload;
    },
    setDepositType: (state, action: PayloadAction<string>) => {
      state.depositType = action.payload;
    },
    setFileType: (state, action: PayloadAction<string>) => {
      state.fileType = action.payload;
    },
    setRepo: (state, action: PayloadAction<FormConfig>) => {
      state.repo = action.payload;
    },
  },
});

export const {
  setActiveStep,
  setRor,
  setNarcis,
  setFileType,
  setDepositType,
  setRepo,
} = repoAdvisorSlice.actions;

export const getActiveStep = (state: RepoAdvisorState) => state.repoAdvisor.activeStep;
export const getRor = (state: RepoAdvisorState) => state.repoAdvisor.ror;
export const getNarcis = (state: RepoAdvisorState) => state.repoAdvisor.narcis;
export const getDepositType = (state: RepoAdvisorState) =>
  state.repoAdvisor.depositType;
export const getFileType = (state: RepoAdvisorState) => state.repoAdvisor.fileType;
export const getRepo = (state: RepoAdvisorState) => state.repoAdvisor.repo;

export default repoAdvisorSlice.reducer;
