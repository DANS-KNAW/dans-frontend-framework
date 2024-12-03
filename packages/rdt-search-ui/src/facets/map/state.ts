import type {
  BaseFacetConfig,
  BaseFacetState,
} from "../../context/state/facets";

export interface MapFacetConfig extends BaseFacetConfig {
  searchOnZoom?: boolean;
  zoom?: number;
  center?: { lon: number; lat: number };
}

export interface MapFacetState extends BaseFacetState {
  // filter: MapFacetFilter | undefined
  searchOnZoom: boolean;
}

export interface MapFacetValue {
  point: [number, number]; // [lat, lon]
  count: number;
}

export interface MapFacetFilter {
  bounds: [number, number, number, number] | undefined; // [latmin, lonmin, latmax, lonmax]
  zoom: number;
}
