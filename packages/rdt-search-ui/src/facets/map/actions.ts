import {
  UpdateFacetFilter,
  UpdateFacetState,
} from "../../context/state/actions";
import { MapFacetFilter } from "./state";

// <UPDATE_FACET_STATE>
interface MapFacetToggleSearchOnZoom extends UpdateFacetState {
  subType: "MAP_FACET_TOGGLE_SEARCH_ON_ZOOM";
}
// <\UPDATE_FACET_STATE>

// <UPDATE_FACET_FILTER>
interface MapFacetSetFilter extends UpdateFacetFilter {
  subType: "MAP_FACET_SET_FILTER";
  value: MapFacetFilter;
}
// </UPDATE_FACET_FILTER>

export type MapFacetAction = MapFacetToggleSearchOnZoom | MapFacetSetFilter;
