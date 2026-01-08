import ListFacet from "../facets/List";
import BarChartFacet from "../facets/BarChart";
import PieChartFacet from "../facets/PieChart";
import TimeRangeFacet from "../facets/TimeRangeChart";

export const FACET_VIEW_MAP = {
  list: ListFacet,
  barchart: BarChartFacet,
  piechart: PieChartFacet,
  timerange: TimeRangeFacet,
  // More to come...
};