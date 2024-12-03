import { ListFacetConfig, ListFacetState, ListFacetValues } from "../state";
import { LIST_FACET_SCROLL_CUT_OFF } from "./list-view";

export interface ListFacetViewState {
  pagination: boolean;
  scroll: boolean;
  scrollButton: boolean;
  query: boolean;
}

export const listFacetViewStates: Record<number, ListFacetViewState> = {
  /** Without query */

  // total < size
  0: { pagination: false, scroll: false, scrollButton: false, query: false },

  // total < LIST_FACET_SCROLL_CUT_OFF
  1: { pagination: false, scroll: false, scrollButton: true, query: false },

  // size === total && total <= LIST_FACET_SCROLL_CUT_OFF
  2: { pagination: false, scroll: true, scrollButton: false, query: false },

  // total > LIST_FACET_SCROLL_CUT_OFF
  3: { pagination: true, scroll: false, scrollButton: false, query: false },

  /** With query */

  4: { pagination: false, scroll: false, scrollButton: false, query: true },

  // values.length === size
  5: { pagination: false, scroll: false, scrollButton: true, query: true },

  // config.size < values.length <= LIST_FACET_SCROLL_CUT_OFF
  6: { pagination: false, scroll: true, scrollButton: false, query: true },
};

// const total = props.facetState.query ? props.values.bucketsCount : props.values.total
// 	total, props.facet.config.size!, props.facetState.size, props.facetState.query)
// console.log(viewState)

export function getViewState(
  values: ListFacetValues,
  state: ListFacetState,
  config: ListFacetConfig,
) {
  if (values == null) return listFacetViewStates[0];

  const total = state.query ? values.bucketsCount : values.total;

  if (state.query?.length) {
    if (total < config.size!) return listFacetViewStates[4];
    else if (total > config.size!) return listFacetViewStates[6];
    else if (total === config.size!) return listFacetViewStates[5];
    else
      throw new Error(
        `[viewState not set] Unexpected total (${total}) for query "${state.query}"`,
      );
  }

  if (total < config.size!) {
    return listFacetViewStates[0];
  } else if (total <= LIST_FACET_SCROLL_CUT_OFF) {
    return state.size === total ?
        listFacetViewStates[2]
      : listFacetViewStates[1];
  } else if (total > LIST_FACET_SCROLL_CUT_OFF) {
    return listFacetViewStates[3];
  } else {
    throw new Error(`[viewState not set] unexpected total (${total})`);
  }
}
