import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import type { InitialFormProps } from '../types/Metadata';

// Save the props we need to redux store, for use in subcomponents
const initialState: Omit<InitialFormProps, 'form'> = {
  targetRepo: '',
  dataverseApiKeyIdentifier: '',
  submitKey: '',
  targetAuth: '',
  targetKey: '',
  skipValidation: false,
  geonamesApiKey: '',
  gsheetsApiKey: '',
};

export const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Omit<InitialFormProps, 'form'>>) => {
      return state = action.payload;
    },
  },
})

export const { setData } = depositSlice.actions;

// Selectors
export const getData = (state: RootState) => state.deposit;

export default depositSlice.reducer;
