import type {
  MapFacetConfig,
  MapFacetFilter,
  MapFacetState,
  MapFacetValue,
} from "../state";

import React from "react";

import FacetWrapper from "../../wrapper";
import { MapFacetController } from "../controller";
import { MapView } from "./map";
import { isConfig } from "../../common";
import styled from "styled-components";
import { FACETS_WIDTH } from "../../../constants";
import type { FacetsDataReducerAction } from "../../../context/state/actions";

const MapFacetWrapper = styled(FacetWrapper)`
  .inner-container {
    display: grid;
    grid-template-rows: 1fr fit-content(0);
    height: 100%;
    min-height: ${FACETS_WIDTH * 0.75}px;
  }
`;

// TODO extend a FacetProps { dispatch, facet, state, filter, values }
export interface MapFacetProps {
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  facet: MapFacetController;
  facetState: MapFacetState;
  filter: MapFacetFilter;
  values: MapFacetValue[];
}

export function MapFacet(props: { config: MapFacetConfig } | MapFacetProps) {
  if (isConfig(props)) return null;
  return <_MapFacet {...props} />;
}
MapFacet.controller = MapFacetController;

function _MapFacet(props: MapFacetProps) {
  if (props.facetState == null) return;

  return (
    <MapFacetWrapper {...props} className="map-facet">
      <div className="inner-container">
        <MapView {...props} dispatch={props.dispatch} />
        <div className="controls">
          <input
            id="search-on-zoom-checkbox"
            type="checkbox"
            checked={props.facetState.searchOnZoom}
            onChange={() => {
              props.dispatch({
                type: "UPDATE_FACET_STATE",
                subType: "MAP_FACET_TOGGLE_SEARCH_ON_ZOOM",
                facetID: props.facet.ID,
              });
            }}
          />
          <label htmlFor="search-on-zoom-checkbox">Search on zoom</label>
        </div>
      </div>
    </MapFacetWrapper>
  );
}
