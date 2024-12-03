import { UpdateFacetFilter } from "../../context/state/actions";

interface ChartFacetSetFilter extends UpdateFacetFilter {
  subType: "CHART_FACET_SET_FILTER";
  value: string;
}

interface ChartFacetSetRange extends UpdateFacetFilter {
  subType: "CHART_FACET_SET_RANGE";
  value: [number, number];
}

export type ChartFacetAction = ChartFacetSetFilter | ChartFacetSetRange;
