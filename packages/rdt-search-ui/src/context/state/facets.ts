import {
  DateChartFacetFilter,
  PieChartFacetFilter,
} from "../../facets/chart/state";
import { ListFacetFilter } from "../../facets/list/state";
import type { MapFacetFilter } from "../../facets/map/state";
import type { LanguageStrings } from "@dans-framework/utils";
import type { FixedFacetsProps  } from "../props";

export interface BaseFacetConfig {
  readonly field: string;
  readonly id?: string;
  readonly title?: string | LanguageStrings;
  readonly description?: string;
  readonly collapse?: boolean;
  readonly groupBy?: Partial<FixedFacetsProps>[];
  readonly groupByLabel?: string;
  cols?: number;
  rows?: number;
  tooltip?: string;
  disableSort?: boolean;
}

export interface FacetFilterObject<T extends FacetFilter> {
  title: string;
  value: T;
  formatted: string[];
}
export type FacetFilter =
  | MapFacetFilter
  | ListFacetFilter
  | PieChartFacetFilter
  | DateChartFacetFilter;

export interface BaseFacetState {
  collapse: boolean;
}
