import type { ElasticSearchResponse, FSResponse } from "./types";

import { FacetControllers } from "../../controllers";
import { ESResponseParser } from "./response-parser";

export interface Bucket {
  key: string | number;
  doc_count: number;
  [key: string]: any;
  name?: string;
}

// The top_hits sub-aggregation lives inside each bucket (see
// request-with-facets-creator.ts), not at the outer filter-agg level, so
// `original_value` must be read per-bucket. Previously it read from the
// outer facetAgg (always undefined) and indexed _source by `facetID` rather
// than by the configured `secondaryId` field, so every bucket got
// `secondaryId: undefined`.
export function getBuckets(
  response: any,
  facetID: string,
  secondaryIdField?: string,
): Bucket[] {
  const facetAgg = response.aggregations?.[facetID];
  if (!facetAgg || !facetAgg[facetID]?.buckets) return [];

  const buckets = facetAgg[facetID].buckets;

  return buckets == null ? [] : buckets.map((bucket: any) => {
    const source = bucket.original_value?.hits?.hits?.[0]?._source;
    const secondaryId =
      secondaryIdField && source ? source[secondaryIdField] : undefined;

    return {
      ...bucket,
      ...(secondaryId !== undefined && { secondaryId }),
    };
  });
}

export function ESResponseWithFacetsParser(
  response: ElasticSearchResponse,
  controllers: FacetControllers,
): [FSResponse, Record<string, any>] {
  const facetValues: Record<string, any> = {};

  for (const facet of controllers.values()) {
    let buckets = getBuckets(response, facet.ID, facet.config.secondaryId);
    facetValues[facet.ID] = facet.responseParser(buckets, response);
  }

  const results = ESResponseParser(response);
  return [results, facetValues];
}
