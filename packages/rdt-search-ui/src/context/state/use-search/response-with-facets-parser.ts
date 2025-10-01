import type { ElasticSearchResponse, FSResponse } from "./types";

import { FacetControllers } from "../../controllers";
import { ESResponseParser } from "./response-parser";

export interface Bucket {
  key: string | number;
  doc_count: number;
  [key: string]: any;
}

export function getBuckets(response: any, facetID: string): Bucket[] {
  const facetAgg = response.aggregations?.[facetID];
  if (!facetAgg || !facetAgg[facetID]?.buckets) return [];

  const buckets = response.aggregations[facetID][facetID]["buckets"];

  return buckets == null ? [] : buckets.map((bucket: any) => {
    // grab the top_hits _source
    const secondaryId = Object.values(facetAgg.original_value?.hits?.hits?.[0]?._source[facetID] || {})[0];

    return {
      ...bucket,
      secondaryId,
    };
  });
  // if (!response.aggregations?.hasOwnProperty(facetID)) return [];

  // const buckets = getByPath(response, `aggregations.${facetID}.${facetID}.buckets`);
  // return buckets == null ? [] : buckets;
}

export function ESResponseWithFacetsParser(
  response: ElasticSearchResponse,
  controllers: FacetControllers,
): [FSResponse, Record<string, any>] {
  const facetValues: Record<string, any> = {};

  for (const facet of controllers.values()) {
    let buckets = getBuckets(response, facet.ID);
    facetValues[facet.ID] = facet.responseParser(buckets, response);
  }

  const results = ESResponseParser(response);
  return [results, facetValues];
}
