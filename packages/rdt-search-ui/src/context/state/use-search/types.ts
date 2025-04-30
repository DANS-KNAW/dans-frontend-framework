import { SortDirection } from "../../../enum";

import type { FacetFilter, FacetFilterObject } from "../facets";

export * from "../facets";

export type Filters = Record<string, FacetFilterObject<FacetFilter>>;

export type SortOrder = Map<string, SortDirection>;
export type SetSortOrder = (sortOrder: SortOrder) => void;

export interface ElasticSearchFacsimile {
  id: string;
  path: string;
}

export interface Result {
  id: string;
  highlight?: Record<string, string[]>;
  [key: string]: any;
}

export interface FSResponse {
  results: Result[];
  total: number;
}

interface Hit {
  _id: string;
  _index: string;
  _score: number;
  _source: any;
  _type: string;
  highlight?: Record<string, string[]>;
}

export interface ElasticSearchResponse {
  aggregations?: { [id: string]: any };
  hits: {
    hits: Hit[];
    max_score: number | null;
    total?: {
      relation: string;
      value: number;
    };
  };
}

export interface FormattedFilter {
  id: string;
  title: string;
  values: string[];
}

export interface ResultBodyProps {
  result: Result;
}
