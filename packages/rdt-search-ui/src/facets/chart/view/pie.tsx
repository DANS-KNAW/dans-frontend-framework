import { ChartFacet } from "./chart";
import { ChartController } from "../chart-controller";
import {
  ChartFacetConfig,
  ChartFacetProps,
  PieChartFacetFilter,
  PieChartFacetState,
} from "../state";
import { isConfig } from "../../common";

export function PieChartFacet(
  props:
    | { config: ChartFacetConfig }
    | ChartFacetProps<
        ChartFacetConfig,
        PieChartFacetState,
        PieChartFacetFilter
      >,
) {
  if (isConfig(props)) return null;

  return (
    <ChartFacet<ChartFacetConfig, PieChartFacetState, PieChartFacetFilter>
      {...props}
    />
  );
}
PieChartFacet.controller = ChartController;
