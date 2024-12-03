import type { Bucket } from "../../context/state/use-search/response-with-facets-parser";
import type {
  ChartFacetConfig,
  PieChartFacetFilter,
  PieChartFacetState,
} from "./state";
import type { ElasticSearchResponse } from "../../context/state/use-search/types";
import type { KeyCount } from "../list/state";
import type { SearchState } from "../../context/state";
import type { FacetsDataReducerAction } from "../../context/state/actions";

import { addFilter } from "../../context/state/use-search/request-with-facets-creator";
import { FacetController } from "../controller";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class PieChartController extends FacetController<
  ChartFacetConfig,
  PieChartFacetState,
  PieChartFacetFilter
> {
  setOptions() {
    return {
      tooltip: {},
      series: [
        {
          type: "pie",
          data: [],
          radius: "60%",
        },
      ],
    };
  }

  updateOptions(values: KeyCount[]) {
    return {
      series: [
        {
          data: values.map((value) => ({
            value: value.count,
            name: value.key,
          })),
        },
      ],
    };
  }

  reducer(state: SearchState, action: FacetsDataReducerAction): SearchState {
    const facetFilter = state.facetFilters.get(this.ID);

    // <FILTER>
    if (action.type === "REMOVE_FILTER") {
      return this.updateFacetFilter(undefined, state);
    }

    if (
      action.type === "UPDATE_FACET_FILTER" &&
      action.subType === "CHART_FACET_SET_FILTER"
    ) {
      if (facetFilter?.value === action.value) return state;
      return this.updateFacetFilter(action.value, state);
    }
    // <\FILTER>

    return state;
  }

  // Config
  protected initConfig(config: ChartFacetConfig): ChartFacetConfig {
    return {
      title: capitalize(config.field),
      ...config,
    };
  }

  // State
  initState(): PieChartFacetState {
    return {
      collapse: this.config.collapse || false,
      initialValues: undefined,
    };
  }

  formatFilter(filter: PieChartFacetFilter) {
    return filter ? [filter] : [];
  }

  // Search request
  createPostFilter(filter: PieChartFacetFilter) {
    if (filter == null) return;

    return {
      term: {
        [this.config.field]: filter,
      },
    };
  }

  createAggregation(postFilters: any) {
    const values = {
      terms: {
        field: this.config.field,
      },
    };

    return addFilter(this.ID, values, postFilters);
  }

  // Search response
  responseParser(
    buckets: Bucket[],
    _response: ElasticSearchResponse,
  ): KeyCount[] {
    return buckets.map((b: Bucket) => ({
      key: b.key.toString(),
      count: b.doc_count,
    }));
  }
}
