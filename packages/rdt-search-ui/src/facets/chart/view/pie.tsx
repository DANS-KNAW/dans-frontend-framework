import { ChartFacet } from "./chart";
import { PieChartController } from "../pie-chart-controller";
import {
  ChartFacetConfig,
  ChartFacetProps,
  PieChartFacetFilter,
  PieChartFacetState,
} from "../state";
import { isConfig } from "../../common";

import styles from "./index.module.css";

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
      className={styles.pie}
    />
  );
}
PieChartFacet.controller = PieChartController;
