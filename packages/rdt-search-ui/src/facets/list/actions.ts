import {
  UpdateFacetFilter,
  UpdateFacetState,
} from "../../context/state/actions";
import type { ListFacetSort } from "./state";

// <UPDATE_FACET_STATE>
interface ListFacetShowAll extends UpdateFacetState {
  subType: "LIST_FACET_SHOW_ALL";
  total: number;
}

interface ListFacetSetPage extends UpdateFacetState {
  subType: "LIST_FACET_SET_PAGE";
  page: number;
}

interface ListFacetSetQuery extends UpdateFacetState {
  subType: "LIST_FACET_SET_QUERY";
  query: string;
}

interface ListFacetSetSort extends UpdateFacetState {
  subType: "LIST_FACET_SET_SORT";
  sort: ListFacetSort;
}
// <\UPDATE_FACET_STATE>

// <UPDATE_FACET_FILTER>
interface ListFacetToggleFilter extends UpdateFacetFilter {
  subType: "LIST_FACET_TOGGLE_FILTER";
  value: string;
}
// <\UPDATE_FACET_FILTER>

export type ListFacetAction =
  | ListFacetShowAll
  | ListFacetSetPage
  | ListFacetSetQuery
  | ListFacetSetSort
  | ListFacetToggleFilter;
