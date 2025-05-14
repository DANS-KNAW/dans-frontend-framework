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
import type { EChartsOption } from 'echarts';

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
  
  setOptions(): EChartsOption {
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
        ...(this.config.legend && {
          legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 10,
            itemWidth: 10,
            textStyle: {
              fontSize: 10,
            },
            selectedMode: false,
          },
        }),
        ...this.config.chartOptions,
      }
    : {
        tooltip: {},
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: [],
        },
        series: [
          {
            type: "bar",
            data: [],
          },
        ],
        grid: {
          top: '1%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        ...this.config.chartOptions,
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
        yAxis: {
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
    // group by label, instead of doing aggregation grouping
    this.config.groupByLabel ?
    {
      terms: {
        field: this.config.groupByLabel,
        size: 100000,
      },
      aggs: {
        total: {
          sum: {
            field: this.config.field
          }
        },
        filter_by_count: {
          bucket_selector: {
            buckets_path: {
              total_count: "total"
            },
            script: "params.total_count > 1"
          }
        },
        order_by_total: {
          bucket_sort: {
            sort: [
              {
                total: {
                  order: "asc"
                }
              }
            ],
          }
        }
      }
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
      count: this.config.groupByLabel ? b.total.value : b.doc_count,
    }));
  }
}
