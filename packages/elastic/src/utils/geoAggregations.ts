import type { ESUIFacet } from "./configConverter";

export function addGeomapAggregations(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  
  if (!externallyHandledFacets) return esRequest;

  const facetAggs = esRequest.aggs?.facet_bucket_all?.aggs || esRequest.aggs || {};

  Object.entries(externallyHandledFacets).forEach(([facetKey, facetConfig]) => {
    if (facetConfig.display !== "geomap") return;

    facetAggs[facetKey] = {
      geohash_grid: {
        field: facetKey,
        precision: 5,
        size: facetConfig.size || 10000
      }
    };
  });

  if (esRequest.aggs?.facet_bucket_all) {
    esRequest.aggs.facet_bucket_all.aggs = facetAggs;
  } else {
    esRequest.aggs = facetAggs;
  }

  return esRequest;
}

export function fixGeoBoundingBoxFilters(
  esRequest: any
) {
  if (!esRequest.query?.bool?.filter) return esRequest;

  // Find and replace term filters that should be geo_bounding_box
  esRequest.query.bool.filter = esRequest.query.bool.filter.map((filterItem: any) => {
    if (filterItem.bool?.filter) {
      filterItem.bool.filter = filterItem.bool.filter.map((innerFilter: any) => {
        // Check if this is a term filter with geo-like structure
        if (innerFilter.term) {
          const field = Object.keys(innerFilter.term)[0];
          const value = innerFilter.term[field];
          
          // If the value has top_left and bottom_right, it's a geo bounding box
          if (value?.top_left && value?.bottom_right) {
            return {
              geo_bounding_box: {
                [field]: value
              }
            };
          }
        }
        return innerFilter;
      });
    }
    return filterItem;
  });

  return esRequest;
}

export function handleGeoFacets(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  let req = addGeomapAggregations(esRequest, externallyHandledFacets);
  req = fixGeoBoundingBoxFilters(req);
  return req;
}
