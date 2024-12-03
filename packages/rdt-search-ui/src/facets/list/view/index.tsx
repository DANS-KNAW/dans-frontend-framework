import type {
  ListFacetConfig,
  ListFacetFilter,
  ListFacetState,
  ListFacetValues,
} from "../state";

import React from "react";

import { ListView } from "./list-view";
import Options from "./options";
import FacetWrapper from "../../wrapper";
import { ListFacetController } from "../controller";
import { isConfig } from "../../common";
import type { FacetsDataReducerAction } from "../../../context/state/actions";
import { ListFacetViewState, getViewState } from "./state";

export interface ListFacetProps {
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  facet: ListFacetController;
  facetState: ListFacetState;
  filter: ListFacetFilter;
  values: ListFacetValues;
  viewState: ListFacetViewState;
}

export function ListFacet(props: { config: ListFacetConfig } | ListFacetProps) {
  if (isConfig(props)) return null;
  return <_ListFacet {...props} />;
}
ListFacet.controller = ListFacetController;

export function _ListFacet(props: ListFacetProps) {
  if (props.facet == null) return null;

  const viewState = getViewState(
    props.values,
    props.facetState,
    props.facet.config,
  );

  return (
    <FacetWrapper {...props} className="list-facet">
      {props.values != null && (viewState.pagination || viewState.query) && (
        <Options {...props}></Options>
      )}
      <ListView {...props} viewState={viewState} />
    </FacetWrapper>
  );
}
