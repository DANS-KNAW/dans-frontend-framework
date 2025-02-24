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

export class ChartController extends FacetController<
  ChartFacetConfig,
  PieChartFacetState,
  PieChartFacetFilter
> {
  chartType: string; // Add this to the class to store the chartType

  constructor(config: ChartFacetConfig) {
    super(config);
    this.chartType = config.chartType || "pie"; // Default to pie chart
  }
  
  setOptions() {
    return this.chartType === "pie"
    ? {
        tooltip: {},
        series: [
          {
            type: "pie",
            data: [],
            radius: "60%",
          },
        ],
      }
    : {
        tooltip: {},
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: [],
          },
        ],
      };
  }

  updateOptions(values: KeyCount[]) {
    return this.chartType === "pie"
    ? {
        series: [
          {
            data: values.map((value) => ({
              value: value.count,
              name: value.key,
            })),
          },
        ],
      }
    : {
        xAxis: {
          data: values.map((value) => value.key),
        },
        series: [
          {
            type: "bar",
            data: values.map((value) => value.count),
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

    // Check for grouped fields, then we need to do a wildcard match (or ngram if we implement that in mapping TODO)
    // For "Other", we must remove all the urls in config.groupBy that match 
    if (this.config.groupBy && this.config.groupBy.length > 0) {
      if (filter !== "Other") {
        return {
          wildcard: {
            [this.config.field]: {
              value: `*${filter}*`,
              case_insensitive: true
            }
          }
        }
      }
      return {
        bool: {
          must_not: this.config.groupBy.map( f => ({
            wildcard: {
              [this.config.field]: `*${f.value}*`
            }
          }))
        }
      }
    }

    return {
      term: {
        [this.config.field]: filter,
      },
    };
  }

  createAggregation(postFilters: any) {
    // For a quick hack, we add a function to the query that groupes data by url match and name
    const fixedFacets = this.config.groupBy;
    const values = fixedFacets ? 
    {
      terms: {
        script: {
          source: `
            def url = doc['${this.config.field}'].value;
            def facets = params.facets;
            for (def facet : facets) {
              if (url != null && url.contains(facet.value)) {
                return facet.name;
              }
            }
            return 'Other';
          `.trim(),
          params: {
            facets: fixedFacets.map(({ name, value }) => ({ name, value })),
          },
        },
      },
    }
    :
    {
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
