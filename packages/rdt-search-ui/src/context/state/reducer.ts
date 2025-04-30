import type { FacetsDataReducerAction } from "./actions";
import type { SearchState } from ".";

import { intialSearchState } from ".";
import { FacetControllers } from "../controllers";

export function searchStateReducer(controllers: FacetControllers) {
  return function (
    state: SearchState,
    action: FacetsDataReducerAction,
  ): SearchState {
    if (action.type === "SET_FACET_STATES") {
      return {
        ...state,
        initialFacetStates: action.facetStates,
        facetStates: action.facetStates,
      };
    }

    if (action.type === "TOGGLE_COLLAPSE") {
      const facetStates = new Map(state.facetStates);
      const facetState = facetStates.get(action.facetID)!;
      facetStates.set(action.facetID, {
        ...facetState,
        collapse: !facetState.collapse,
      });

      return {
        ...state,
        facetStates,
      };
    }

    if (action.type === "UPDATE_FACET_STATE") {
      const controller = controllers.get(action.facetID);
      const nextState = controller?.reducer(state, action);
      if (nextState) return nextState;
    }

    if (action.type === "UPDATE_FACET_FILTER") {
      const controller = controllers.get(action.facetID);
      const nextState = controller?.reducer(state, action);
      if (nextState) {
        nextState.currentPage = 1;
        return nextState;
      }
    }

    if (action.type === "REMOVE_FILTER") {
      const controller = controllers.get(action.facetID);
      const nextState = controller?.reducer(state, action);
      if (nextState) {
        nextState.currentPage = 1;
        return nextState;
      }
    }

    if (action.type === "SET_SEARCH_RESULT") {
      const initialSearchResult =
        action.searchResult != null && state.initialSearchResult == null ?
          action.searchResult
        : state.initialSearchResult;

      const initialFacetValues =
        action.facetValues != null && state.initialFacetValues == null ?
          action.facetValues
        : state.initialFacetValues;

      return {
        ...state,
        initialSearchResult,
        initialFacetValues,
        searchResult:
          action.searchResult != null ?
            action.searchResult
          : state.searchResult,
        facetValues:
          action.facetValues != null ? action.facetValues : state.facetValues,
      };
    }

    if (action.type === "SET_ERROR") {
      return {
        ...state,
        error: action.error,
      };
    }

    if (action.type === "SET_LOADING") {
      return {
        ...state,
        loading: action.loading,
      };
    }

    if (action.type === "UPDATE_FACET_VALUES") {
      const facetValues = { ...state.facetValues };
      facetValues[action.ID] = action.values;

      return {
        ...state,
        facetValues,
      };
    }

    if (action.type === "LOAD_SEARCH") {
      return {
        ...state,
        query: action.query,
        facetFilters: action.filters,
        currentPage: 1,
      };
    }

    if (action.type === "SET_QUERY") {
      return {
        ...state,
        query: action.value,
        currentPage: 1,
      };
    }

    if (action.type === "SET_PAGE") {
      return {
        ...state,
        currentPage: action.page,
      };
    }

    if (action.type === "SET_SORT_ORDER") {
      return {
        ...state,
        sortOrder: action.sortOrder,
      };
    }

    if (action.type === "RESET") {
      return {
        ...state,
        ...intialSearchState,
        facetStates: state.initialFacetStates!,
        searchResult: state.initialSearchResult,
        facetValues: state.initialFacetValues!,
      };
    }

    return state;
  };
}

// Create a new map of facet filters from the facet states
// function createFacetFiltersMap(facetStates: SearchState['facetStates']) {
// 	const m = new Map()

// 	for (const [id, facetState] of facetStates.entries()) {
// 		if (facetState.filter != null) {
// 			m.set(id, facetState.filter)
// 		}
// 	}

// 	return m
// }
