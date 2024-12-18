import type { Bucket } from "../../context/state/use-search/response-with-facets-parser";
import type {
  MapFacetState,
  MapFacetConfig,
  MapFacetValue,
  MapFacetFilter,
} from "./state";
import type { FacetFilterObject } from "../../context/state/facets";
import type { ElasticSearchResponse } from "../../context/state/use-search/types";

import ngeohash from "ngeohash";

import { addFilter } from "../../context/state/use-search/request-with-facets-creator";
import { MapFacet } from "./view";
import { FacetController } from "../controller";
import { SearchState } from "../../context/state";
import { FacetsDataReducerAction } from "../../context/state/actions";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class MapFacetController extends FacetController<
  MapFacetConfig,
  MapFacetState,
  MapFacetFilter
> {
  View = MapFacet;

  reducer(state: SearchState, action: FacetsDataReducerAction): SearchState {
    const facetState = state.facetStates.get(this.ID) as MapFacetState;
    const nextState = { ...facetState };

    // <STATE>
    if (
      action.type === "UPDATE_FACET_STATE" &&
      action.subType === "MAP_FACET_TOGGLE_SEARCH_ON_ZOOM"
    ) {
      nextState.searchOnZoom = !nextState.searchOnZoom;
      return this.updateFacetState(nextState, state);
    }
    // <\STATE>

    const facetFilter = state.facetFilters.get(this.ID) as
      | FacetFilterObject<MapFacetFilter>
      | undefined;

    // <FILTER>
    if (action.type === "REMOVE_FILTER") {
      return this.updateFacetFilter(undefined, state);
    }

    if (
      action.type === "UPDATE_FACET_FILTER" &&
      action.subType === "MAP_FACET_SET_FILTER"
    ) {
      // Only update the filter when it has changed,
      // this happens when the filter is not yet set (undefined)
      // and the user triggers a reset (again undefined)
      const isUpdate = facetFilter?.value !== action.value;

      // Dispatch the change if the filter has changed
      // and the searchOnZoom is enabled
      if (isUpdate && facetState.searchOnZoom) {
        return this.updateFacetFilter(action.value, state);
      }
    }
    // <\FILTER>

    return state;
  }

  // private dispatchChange() {
  // 	const detail = { ID: this.ID, state: { ...this.state } }

  // 	this.dispatchEvent(
  // 		new CustomEvent(EventName.FacetStateChange, { detail })
  // 	)
  // }

  // Config
  protected initConfig(config: MapFacetConfig): MapFacetConfig {
    return {
      title: capitalize(config.field),
      zoom: config.zoom || 0,
      ...config,
    };
  }

  // State
  initState(): MapFacetState {
    return {
      collapse: this.config.collapse || false,
      searchOnZoom: this.config.searchOnZoom || true,
    };
  }

  formatFilter(filter: MapFacetFilter) {
    if (filter?.bounds == null) return [];
    return [filter.bounds.map((f) => f.toFixed(2)).join(", ")];
  }

  // Search request
  createPostFilter(filter: MapFacetFilter) {
    let bounds = undefined;
    if (filter != null) {
      let [lonmin, latmax, lonmax, latmin] = filter.bounds as [
        number,
        number,
        number,
        number,
      ];
      if (lonmin < -180) lonmin = -180;
      if (lonmax > 180) lonmax = 180;
      if (latmax < -90) latmax = -90;
      if (latmin > 90) latmin = 90;
      bounds = {
        top_left: `${latmin}, ${lonmin}`,
        bottom_right: `${latmax}, ${lonmax}`,
      };
    }

    if (bounds == null) return;

    return {
      geo_bounding_box: {
        [this.config.field]: bounds,
      },
    };
  }

  createAggregation(postFilters: any, filter: MapFacetFilter) {
    // if filter is not set, use the zoom set in the config
    const zoom = filter?.zoom == null ? this.config.zoom : filter.zoom;

    let precision = Math.ceil(zoom || 0);
    if (precision < 1) precision = 1;
    if (precision > 12) precision = 12;

    const values = {
      geohash_grid: {
        field: this.config.field,
        precision,
      },
    };

    return addFilter(this.ID, values, postFilters);
  }

  // Search response
  responseParser(
    buckets: Bucket[],
    _response: ElasticSearchResponse,
  ): MapFacetValue[] {
    return buckets.map((bucket) => {
      const point = ngeohash.decode(bucket.key as string);
      return {
        point: [point.latitude, point.longitude],
        count: bucket.doc_count,
      };
    });
  }
}
