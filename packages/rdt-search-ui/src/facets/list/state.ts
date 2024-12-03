import type {
  BaseFacetConfig,
  BaseFacetState,
} from "../../context/state/facets";

import { SortBy, SortDirection } from "../../enum";

export interface ListFacetConfig extends BaseFacetConfig {
  size?: number;
  sort?: ListFacetSort;
}

export interface ListFacetState extends BaseFacetState {
  query: string | undefined;
  size: number;
  page: number;
  // TODO move to viewState?
  scroll: boolean;
  sort: ListFacetSort;
}

export interface KeyCount {
  key: string;
  count: number;
}

export interface ListFacetValues {
  bucketsCount: number;
  total: number;
  values: KeyCount[];
}

export type ListFacetFilter = Set<string>;

export interface ListFacetSort {
  by: SortBy;
  direction: SortDirection;
}
