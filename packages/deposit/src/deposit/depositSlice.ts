import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import type { FormConfig } from '../types/Metadata';

// Save the props we need to redux store, for use in subcomponents
const initialState: Omit<FormConfig, 'form'> = {
  targetCredentials: [],
  target: {},
  submitKey: '',
  skipValidation: false,
  geonamesApiKey: '',
  gsheetsApiKey: '',
};

export const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Omit<FormConfig, 'form'>>) => {
      return state = action.payload;
    },
  },
})

export const { setData } = depositSlice.actions;

// Selectors
export const getData = (state: RootState) => state.deposit;

export default depositSlice.reducer;
