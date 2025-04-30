import type { BaseFacetState, FacetFilterObject, FacetFilter } from "./facets";
import type { SortOrder, FSResponse } from "./use-search/types";

import React from "react";
import { FacetsDataReducerAction } from "./actions";

/**
 * SearchState
 *
 * Context to keep the state of the full text input and the facets. This
 * context is also used in other parts of the Docere UI to adjust the
 * search state.
 */

type FacetStates = Map<string, BaseFacetState>;

export interface SearchState {
  currentPage: number;
  sortOrder: SortOrder;
  searchResult: FSResponse | undefined;

  facetValues: Record<string, any>;
  facetStates: FacetStates;
  facetFilters: Map<string, FacetFilterObject<FacetFilter>>;

  query: string;

  initialSearchResult?: FSResponse;
  initialFacetStates?: FacetStates;
  initialFacetValues?: Record<string, any>;

  loading: boolean;
  error?: any;
}

export const intialSearchState = {
  currentPage: 1,
  facetFilters: new Map(),
  facetStates: new Map(),
  facetValues: {},
  query: "",
  searchResult: undefined,
  sortOrder: new Map(),
  loading: false,
};

export const SearchStateContext =
  React.createContext<SearchState>(intialSearchState);

export const SearchStateDispatchContext = React.createContext<
  React.Dispatch<FacetsDataReducerAction>
>(() => {});
