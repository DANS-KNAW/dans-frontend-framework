import type { MapFacetFilter } from "../../facets/map/state";
import type { SearchState } from ".";
import { ListFacetAction } from "../../facets/list/actions";
import { MapFacetAction } from "../../facets/map/actions";
import { ChartFacetAction } from "../../facets/chart/actions";

export interface UpdateFacetState {
  type: "UPDATE_FACET_STATE";
  facetID: string;
}

export interface UpdateFacetFilter {
  type: "UPDATE_FACET_FILTER";
  facetID: string;
}

interface SetFacetStates {
  type: "SET_FACET_STATES";
  facetStates: SearchState["facetStates"];
}

interface RemoveFilter {
  type: "REMOVE_FILTER";
  facetID: string;
  value?: string;
}

interface ToggleCollapse {
  type: "TOGGLE_COLLAPSE";
  facetID: string;
}

interface UpdateFacetValues {
  type: "UPDATE_FACET_VALUES";
  ID: string;
  values: SearchState["facetValues"];
}

interface SetSearchFilter {
  type: "SET_FILTER";
  facetId: string;
  value: string | string[] | MapFacetFilter; // | HistogramFacetValue
}

interface SetSearchResult {
  type: "SET_SEARCH_RESULT";
  searchResult?: SearchState["searchResult"];
  facetValues?: SearchState["facetValues"];
}

interface SetLoading {
  type: "SET_LOADING";
  loading: boolean;
}

interface SetError {
  type: "SET_ERROR";
  error: any;
}

interface SetQuery {
  type: "SET_QUERY";
  value: string;
}

interface Reset {
  type: "RESET";
}

interface SetSortOrder {
  type: "SET_SORT_ORDER";
  sortOrder: SearchState["sortOrder"];
}

interface SetPage {
  type: "SET_PAGE";
  page: number;
}

interface LoadSearch {
  type: "LOAD_SEARCH";
  filters: SearchState["facetFilters"];
  query: SearchState["query"];
}

export type FacetsDataReducerAction =
  | MapFacetAction
  | ListFacetAction
  | ChartFacetAction
  | RemoveFilter
  | LoadSearch
  | Reset
  | SetFacetStates
  | SetPage
  | SetQuery
  | SetSearchFilter
  | SetSearchResult
  | SetSortOrder
  | ToggleCollapse
  | UpdateFacetValues
  | SetError
  | SetLoading;
