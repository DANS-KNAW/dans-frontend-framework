import type {
  MapFacetConfig,
  MapFacetFilter,
  MapFacetState,
  MapFacetValue,
} from "../state";

import { type Dispatch } from "react";
import FacetWrapper from "../../wrapper";
import { MapFacetController } from "../controller";
import { MapView } from "./map";
import { isConfig } from "../../common";
import type { FacetsDataReducerAction } from "../../../context/state/actions";
import { useTranslation } from "react-i18next";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// TODO extend a FacetProps { dispatch, facet, state, filter, values }
export interface MapFacetProps {
  dispatch: Dispatch<FacetsDataReducerAction>;
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
  const { t } = useTranslation('views');

  if (props.facetState == null) return;

  return (
    <FacetWrapper {...props}>
      <MapView {...props} dispatch={props.dispatch} />
      <FormGroup>
        <FormControlLabel 
          control={
            <Switch 
              checked={props.facetState.searchOnZoom} 
              onChange={() => {
                props.dispatch({
                  type: "UPDATE_FACET_STATE",
                  subType: "MAP_FACET_TOGGLE_SEARCH_ON_ZOOM",
                  facetID: props.facet.ID,
                });
              }}
            />
          } 
          label={t('searchOnZoom')}
        />
      </FormGroup>
    </FacetWrapper>
  );
}
