import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Filter } from '@elastic/search-ui';

interface InitialStateType {
  searchFilters: Filter[] | undefined;
}

const initialState: InitialStateType = {
  searchFilters: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<Filter[] | undefined>) => {
      console.log('Reducer saving filters to state:', action.payload);
      state.searchFilters = action.payload;
    },
    clearSearchFilters: (state) => {
      state.searchFilters = undefined;
    },
  },
});

export type SearchState = { elastic: InitialStateType };

export const { setSearchFilters, clearSearchFilters } = searchSlice.actions;
export const getSearchFilters = (state: SearchState) => state.elastic.searchFilters;

export default searchSlice.reducer;