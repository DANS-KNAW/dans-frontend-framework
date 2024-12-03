import { ChartFacetController } from "./controller";
import type {
  BaseFacetConfig,
  BaseFacetState,
  FacetFilter,
} from "../../context/state/facets";
import type { KeyCount } from "../list/state";
import { FacetsDataReducerAction } from "../../context/state/actions";

export interface ChartFacetConfig extends BaseFacetConfig {}

export interface DateChartFacetConfig extends ChartFacetConfig {
  interval: "year" | "quarter" | "month" | "day" | "hour" | "minute";
}

export interface ChartFacetState extends BaseFacetState {
  // filter: string | [number, number] | undefined
  initialValues: KeyCount[] | KeyCountMap | undefined;
}

export interface PieChartFacetState extends ChartFacetState {
  initialValues: KeyCount[] | undefined;
}

export type PieChartFacetFilter = string | undefined;
export type DateChartFacetFilter = string | [number, number] | undefined;

export interface DateChartFacetState extends ChartFacetState {
  // Filter is a:
  // 		- date string (e.g. '2020' or '2020-01-01')
  //		or
  // 		- range of percentages (e.g. [25, 100])
  initialValues: KeyCountMap | undefined;
}

export type KeyCountMap = Map<string, number>;

export interface ChartFacetProps<
  Config extends ChartFacetConfig,
  State extends ChartFacetState,
  Filter extends FacetFilter,
> {
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  facet: ChartFacetController<Config, State, Filter>;
  facetState: State;
  filter: Filter;
  values: NonNullable<State["initialValues"]>;
}
