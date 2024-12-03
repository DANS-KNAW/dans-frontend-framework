import type {
  ChartFacetConfig,
  ChartFacetProps,
  ChartFacetState,
} from "../state";

import React from "react";
import * as echarts from "echarts";

import FacetWrapper from "../../wrapper";
import debounce from "lodash.debounce";
import { FacetFilter } from "../../../context/state/facets";
import Typography from "@mui/material/Typography";

import styles from "./index.module.css";

export function ChartFacet<
  Config extends ChartFacetConfig,
  State extends ChartFacetState,
  Filter extends FacetFilter,
>(props: ChartFacetProps<Config, State, Filter> & { className: string }) {
  // Ref to the chart instance
  const chart = React.useRef<echarts.ECharts | null>(null);

  // Ref to the container element
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Initialize the chart
  React.useEffect(() => {
    if (containerRef.current == null) return;

    // Initialize the chart and set the container element
    chart.current = echarts.init(containerRef.current);

    const options = props.facet.setOptions();
    // Set the options
    chart.current.setOption(options);

    // Add click event listener
    chart.current.on("click", (params) => {
      props.dispatch({
        type: "UPDATE_FACET_FILTER",
        subType: "CHART_FACET_SET_FILTER",
        facetID: props.facet.ID,
        value: params.name,
      });
    });

    chart.current.on(
      "datazoom",
      debounce((params: any) => {
        props.dispatch({
          type: "UPDATE_FACET_FILTER",
          subType: "CHART_FACET_SET_RANGE",
          facetID: props.facet.ID,
          value: [params.start, params.end],
        });
      }, 1000),
    );

    window.addEventListener(
      "resize",
      debounce(() => chart.current?.resize(), 200),
    );

    return () => chart.current?.dispose();
  }, [props.values]);

  // Update the chart when the values change
  React.useEffect(() => {
    if (props.values == null || chart.current == null) return;

    const options = props.facet.updateOptions(props.values, props.filter);

    chart.current.setOption(options);

    //resize to make sure it fits container
    chart.current.resize();
  }, [props.values]);

  return (
    <FacetWrapper {...props}>
      {
        // some logic to check if there's actually data available
        // if it's an array, check if it has any values
        (
          (props.values &&
            Array.isArray(props.values) &&
            props.values.length === 0) ||
          // if it's a map, check if there are values other than 0
          (props.values &&
            props.values instanceof Map &&
            [...props.values.values()].every((value) => value === 0)) ||
          props.values === undefined
        ) ?
          <Typography variant="body2" sx={{ color: "neutral.dark" }}>
            No data found
          </Typography>
        : <div className={styles.innerContainer} ref={containerRef} />
      }
    </FacetWrapper>
  );
}
