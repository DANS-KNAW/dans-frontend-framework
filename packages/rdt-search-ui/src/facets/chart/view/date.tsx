import { ChartFacet } from "./chart";
import { DateChartController } from "../date-chart-controller";
import type {
  ChartFacetProps,
  DateChartFacetConfig,
  DateChartFacetFilter,
  DateChartFacetState,
} from "../state";
import { isConfig } from "../../common";

import styles from "./index.module.css";

export function DateChartFacet(
  props:
    | { config: DateChartFacetConfig }
    | ChartFacetProps<
        DateChartFacetConfig,
        DateChartFacetState,
        DateChartFacetFilter
      >,
) {
  if (isConfig(props)) return null;
  return (
    <ChartFacet<DateChartFacetConfig, DateChartFacetState, DateChartFacetFilter>
      {...props}
      className={styles.date}
    />
  );
}
DateChartFacet.controller = DateChartController;
