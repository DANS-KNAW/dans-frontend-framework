import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Filter } from '@elastic/search-ui';
import type { ResultViewConfig } from '../utils/configConverter';

interface InitialStateType {
  searchFilters: Filter[] | undefined;
  resultViewConfig: any;
}

const initialState: InitialStateType = {
  searchFilters: [],
  resultViewConfig: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<Filter[] | undefined>) => {
      state.searchFilters = action.payload;
    },
    clearSearchFilters: (state) => {
      state.searchFilters = undefined;
    },
    setResultViewConfig: (state, action: PayloadAction<ResultViewConfig>) => {
      state.resultViewConfig = action.payload;
    }
  },
});

export type SearchState = { elastic: InitialStateType };

export const { setSearchFilters, clearSearchFilters, setResultViewConfig } = searchSlice.actions;
export const getSearchFilters = (state: SearchState) => state.elastic.searchFilters;
export const getResultViewConfig = (state: SearchState) => state.elastic.resultViewConfig;

export default searchSlice.reducer;