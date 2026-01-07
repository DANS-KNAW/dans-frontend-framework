import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialStateType {
  searchFilters: any[];
}

const initialState: InitialStateType = {
  searchFilters: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<any[]>) => {
      console.log('Reducer saving filters to state:', action.payload);
      state.searchFilters = action.payload;
    },
    clearSearchFilters: (state) => {
      state.searchFilters = [];
    },
  },
});

export type SearchState = { elastic: InitialStateType };

export const { setSearchFilters, clearSearchFilters } = searchSlice.actions;
export const getSearchFilters = (state: SearchState) => state.elastic.searchFilters;

export default searchSlice.reducer;