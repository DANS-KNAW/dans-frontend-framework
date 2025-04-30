import type { Bucket } from "../../context/state/use-search/response-with-facets-parser";
import type {
  ListFacetState,
  ListFacetConfig,
  ListFacetValues,
  ListFacetFilter,
} from "./state";
import type { FacetFilterObject } from "../../context/state/facets";
import type { ElasticSearchResponse } from "../../context/state/use-search/types";

import { addFilter } from "../../context/state/use-search/request-with-facets-creator";
import { FacetController } from "../controller";
import { SearchState } from "../../context/state";
import { LIST_FACET_SCROLL_CUT_OFF } from "./view/list-view";
import { FacetsDataReducerAction } from "../../context/state/actions";
import { SortBy, SortDirection } from "../../enum";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeFilterValue(
  facetFilter: ListFacetFilter | undefined,
  value: string,
) {
  if (facetFilter == null) return undefined;
  facetFilter.delete(value);
  return facetFilter.size ? facetFilter : undefined;
}

interface ListAggregationTerms {
  field: string;
  include?: string;
  order?: { [sb in SortBy]?: SortDirection };
  size: number;
}

export class ListFacetController extends FacetController<
  ListFacetConfig,
  ListFacetState,
  ListFacetFilter
> {
  reducer(state: SearchState, action: FacetsDataReducerAction): SearchState {
    const facetState = state.facetStates?.get(this.ID) as ListFacetState;
    const nextState = { ...facetState };

    // <STATE>
    if (action.type === "UPDATE_FACET_STATE") {
      if (action.subType === "LIST_FACET_SHOW_ALL") {
        // TODO remove scroll?
        nextState.scroll = true;

        nextState.page = 1;
        nextState.size =
          state.query?.length ? LIST_FACET_SCROLL_CUT_OFF : action.total;
      }

      if (action.subType === "LIST_FACET_SET_PAGE") {
        nextState.page = action.page;
        nextState.size = action.page * this.config.size!;
        nextState.scroll = false;
      }

      if (action.subType === "LIST_FACET_SET_QUERY") {
        nextState.page = 1;
        nextState.query = action.query.length ? action.query : undefined;
        nextState.scroll = false;
        nextState.size = this.config.size!;
      }

      if (action.subType === "LIST_FACET_SET_SORT") {
        nextState.page = 1;
        nextState.sort = action.sort;
        nextState.size = this.config.size!;
      }

      return this.updateFacetState(nextState, state);
    }
    // <\STATE>

    const facetFilterObject = state.facetFilters.get(this.ID) as
      | FacetFilterObject<ListFacetFilter>
      | undefined;
    const facetFilter =
      facetFilterObject == null ?
        new Set<string>()
      : new Set(facetFilterObject.value);

    // <FILTER>
    if (action.type === "REMOVE_FILTER") {
      const nextFilter = removeFilterValue(facetFilter, action.value!);
      return this.updateFacetFilter(nextFilter, state);
    }

    if (
      action.type === "UPDATE_FACET_FILTER" &&
      action.subType === "LIST_FACET_TOGGLE_FILTER"
    ) {
      facetState.page = 1;
      facetState.size = this.config.size!;
      facetState.query = undefined;
      const nextState = this.updateFacetState(facetState, state);

      if (facetFilterObject?.value.has(action.value)) {
        const nextFilter = removeFilterValue(facetFilter, action.value);
        return this.updateFacetFilter(nextFilter, nextState);
      } else {
        facetFilter.add(action.value);
        return this.updateFacetFilter(facetFilter, nextState);
      }
    }
    // <\FILTER>

    return state;
  }

  // Config
  protected initConfig(config: ListFacetConfig): ListFacetConfig {
    if (config.sort == null) delete config.sort;

    return {
      title: capitalize(config.field),
      sort: {
        by: SortBy.Count,
        direction: SortDirection.Desc,
      },
      ...config,
      size: config.size || 10 /* if size is null, default to 10 */,
    };
  }

  // State
  initState(): ListFacetState {
    return {
      collapse: this.config.collapse || false,
      query: undefined,
      size: this.config.size!,
      page: 1,
      scroll: false,
      sort: this.config.sort!,
    };
  }

  formatFilter(filter: ListFacetFilter) {
    return Array.from(filter || []);
  }

  // Search request
  createPostFilter(filter: ListFacetFilter) {
    if (filter == null) return;

    const allFacetFilters = [...filter].map((key) => ({
      term: { [this.config.field]: key },
    }));
    if (allFacetFilters.length === 1) return allFacetFilters[0];
    else if (allFacetFilters.length > 1)
      return { bool: { must: allFacetFilters } };

    return;
  }

  createAggregation(
    postFilters: any,
    _filter: ListFacetFilter,
    state: ListFacetState,
  ) {
    const terms: ListAggregationTerms = {
      field: this.config.field,
      size: state.size,
    };

    // TODO is always filled? or only add when not the default (sort by frequency descending)?
    if (state.sort != null) {
      terms.order = {
        [state.sort.by]: state.sort.direction,
      };
    }

    if (state.query?.length) {
      // Turn query into hacky case insensitive regex,
      // because ES doesn't support case insensitive include in terms aggregation
      // For example: "test" -> "(t|T)(e|E)(s|S)(t|T)"
      const query = [...state.query]
        .map((c) => {
          const C = c.toUpperCase() === c ? c.toLowerCase() : c.toUpperCase();
          return `(${c}|${C})`;
        })
        .join("");

      terms.include = `.*${query}.*`;
    }

    const agg = {
      ...addFilter(this.ID, { terms }, postFilters),
      ...addFilter(
        `${this.ID}-count`,
        {
          cardinality: {
            field: this.config.field,
          },
        },
        postFilters,
      ),
    };

    return agg;
  }

  // Search response
  responseParser(
    buckets: Bucket[],
    response: ElasticSearchResponse,
  ): ListFacetValues {
    if (response.aggregations == null)
      return { bucketsCount: 0, total: 0, values: [] };

    return {
      bucketsCount: buckets.length,
      total:
        response.aggregations[`${this.ID}-count`][`${this.ID}-count`].value,
      values: buckets.map((b: Bucket) => ({
        key: b.key.toString(),
        count: b.doc_count,
      })),
    };
  }
}

export default ListFacetController;
