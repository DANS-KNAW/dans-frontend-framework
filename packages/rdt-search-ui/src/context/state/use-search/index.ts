import type { SearchState } from "..";
import type { SearchProps } from "../../props";
import type { FacetsDataReducerAction } from "../actions";

import React from "react";

import { ESRequestWithFacets } from "./request-with-facets-creator";
import {
  ESResponseWithFacetsParser,
  getBuckets,
} from "./response-with-facets-parser";
import { ESResponseParser } from "./response-parser";
import { fetchSearchResult } from "./fetch";
import { ESRequest } from "./request-creator";
import { FacetControllers } from "../../controllers";
import { FacetController } from "../../../facets/controller";
import { BaseFacetConfig, BaseFacetState, FacetFilter } from "../facets";

interface UseSearchProps {
  props: SearchProps;
  state: SearchState;
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  controllers: FacetControllers;
}

export function useSearch({
  props,
  state,
  dispatch,
  controllers,
}: UseSearchProps) {
  const prev = usePrevious(state);

  React.useEffect(() => {
    if (props.url == null || props.url.length === 0 || controllers.size === 0)
      return; // || searchState.isInitialSearch) return

    const changedProps =
      prev == null ?
        Object.keys(state)
      : Object.keys(state).filter(
          (key) =>
            state[key as keyof SearchState] !== prev[key as keyof SearchState],
        );

    // Only the sort order or page has changed, only update the search result
    if (
      changedProps.length === 1 &&
      (changedProps[0] === "sortOrder" || changedProps[0] === "currentPage")
    ) {
      fetchSearchResultOnly(state, props, controllers, dispatch).then(
        (searchResult) => {
          dispatch({
            type: "SET_SEARCH_RESULT",
            searchResult,
          });
        },
      );
      return;

      // Only facet states have changed, only update the facet values of one facet
    } else if (changedProps.length === 1 && changedProps[0] === "facetStates") {
      // Get the ID of the changed facet
      const facetID = Array.from(state.facetStates.keys()).find((key) => {
        return state.facetStates.get(key) !== prev?.facetStates?.get(key);
      });
      if (facetID == null) return;

      const facetController = controllers.get(facetID);
      if (facetController == null) return;

      fetchFacetValuesOnly(
        state,
        props,
        controllers,
        facetController,
        dispatch,
      ).then((values) => {
        dispatch({
          type: "UPDATE_FACET_VALUES",
          values,
          ID: facetController.ID,
        });
      });

      // The URL, query or facet filters have changed, update the search result and facets
    } else {
      // Make sure we only do this when there's something in the facetStates, as this function gets called a few times.
      // Otherwise this could overwrite the previously fetched data with incomplete data, as it's not synchronous
      state.facetStates.size !== 0 &&
        fetchSearchResultWithFacets(state, props, controllers, dispatch).then(
          ([searchResult, facetValues]) => {
            dispatch({
              type: "SET_SEARCH_RESULT",
              searchResult,
              facetValues,
            });
          },
        );
    }
  }, [
    // Update the search result and facets
    props.url,
    state.query,
    state.facetFilters,

    // Update only the search result
    state.currentPage,
    state.sortOrder,

    state.facetStates,
  ]);
}

async function fetchSearchResultOnly(
  searchState: SearchState,
  searchProps: SearchProps,
  controllers: FacetControllers,
  dispatch: any,
) {
  const { payload } = new ESRequest(searchState, searchProps, controllers);
  const response = await fetchSearchResult(searchProps.url, payload, dispatch);
  const result = ESResponseParser(response);
  return result;
}

async function fetchSearchResultWithFacets(
  searchState: SearchState,
  searchProps: SearchProps,
  controllers: FacetControllers,
  dispatch: any,
) {
  const { payload } = new ESRequestWithFacets(
    searchState,
    searchProps,
    controllers,
  );
  const response = await fetchSearchResult(searchProps.url, payload, dispatch);
  const result = ESResponseWithFacetsParser(response, controllers);
  return result;
}

async function fetchFacetValuesOnly(
  searchState: SearchState,
  searchProps: SearchProps,
  controllers: FacetControllers,
  controller: FacetController<BaseFacetConfig, BaseFacetState, FacetFilter>,
  dispatch: any,
) {
  // Create a regular payload of a search with facets
  const { payload } = new ESRequestWithFacets(
    searchState,
    searchProps,
    controllers,
  );

  // Remove the aggregations of the other facets
  Object.keys(payload.aggs!).forEach((key) => {
    // If the key of the aggregation does not start with the facet ID, remove it
    // For example a key can be: "some_list_facet" and "some_list_facet-count",
    // the count is not strictly needed, but that is an optimization for later
    if (key.slice(0, controller.ID.length) !== controller.ID) {
      delete payload.aggs![key];
    }
  });

  // The search result is not needed
  payload.size = 0;
  payload.track_total_hits = false;

  // Fetch the response
  const response = await fetchSearchResult(searchProps.url, payload, dispatch);

  // Parse only the facet values of the requested facet
  let buckets = getBuckets(response, controller.ID);
  return controller.responseParser(buckets, response);
}

function usePrevious(value: SearchState) {
  const ref = React.useRef<SearchState>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
