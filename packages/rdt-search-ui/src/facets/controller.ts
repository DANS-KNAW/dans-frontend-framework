import type { ElasticSearchResponse } from "../context/state/use-search/types";
import type {
  BaseFacetConfig,
  BaseFacetState,
  FacetFilter,
} from "../context/state/facets";
import type { Bucket } from "../context/state/use-search/response-with-facets-parser";
import { SearchState } from "../context/state";
import { FacetsDataReducerAction } from "../context/state/actions";
import { lookupLanguageString } from "@dans-framework/utils";
import i18n from "../languages/i18n";

export abstract class FacetController<
  FacetConfig extends BaseFacetConfig,
  FacetState extends BaseFacetState,
  Filter extends FacetFilter,
> extends EventTarget {
  ID: string;
  config: FacetConfig;

  constructor(initialConfig: FacetConfig) {
    super();

    this.ID =
      initialConfig.id ?
        initialConfig.id
      : `${initialConfig.field}-${Math.random().toString().slice(2, 8)}`;
    // TODO move config to state or props?
    this.config = this.initConfig(initialConfig);
  }

  abstract formatFilter(filter: Filter): string[];
  abstract createAggregation(
    postFilters: any,
    filter: Filter,
    state: FacetState,
  ): any;

  // Create a post filter, which is used by ES to filter the search results
  // If there is no filter, return undefined
  abstract createPostFilter(filter: Filter): any;

  abstract reducer(
    state: SearchState,
    action: FacetsDataReducerAction,
  ): SearchState;

  abstract responseParser(
    buckets: Bucket[],
    response: ElasticSearchResponse,
  ): any;

  protected abstract initConfig(config: FacetConfig): FacetConfig;
  abstract initState(): FacetState;

  updateFacetState(nextFacetState: FacetState, state: SearchState) {
    const facetStates = new Map(state.facetStates);
    facetStates.set(this.ID, nextFacetState);

    return {
      ...state,
      facetStates,
    };
  }

  updateFacetFilter(filter: Filter | undefined, state: SearchState) {
    const facetFilters = new Map(state.facetFilters);

    if (filter == null) {
      facetFilters.delete(this.ID);
    } else {
      facetFilters.set(this.ID, {
        title: lookupLanguageString(this.config.title, i18n.language) || "",
        value: filter,
        formatted: this.formatFilter(filter),
      });
    }

    return {
      ...state,
      facetFilters,
    };
  }
}
