import type { ESUIFacet } from "./configConverter";

export function handleDateFacets(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  if (!externallyHandledFacets) return esRequest;

  const facetAggs = esRequest.aggs?.facet_bucket_all?.aggs || esRequest.aggs || {};

  Object.entries(externallyHandledFacets).forEach(([facetKey, facetConfig]) => {
    if (facetConfig.display !== "date") return;

    facetAggs[facetKey] = {
      date_histogram: {
        field: facetKey,
        calendar_interval: facetConfig.interval || "year",
        format: facetConfig.format || "yyyy",
        min_doc_count: 0, // Include empty buckets
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
