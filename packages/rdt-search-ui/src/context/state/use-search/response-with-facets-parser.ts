import type { ElasticSearchResponse, FSResponse } from "./types";

import { FacetControllers } from "../../controllers";
import { ESResponseParser } from "./response-parser";

export interface Bucket {
  key: string | number;
  doc_count: number;
  [key: string]: any;
  name?: string;
}
// export function getBuckets(response: any, facetID: string): Bucket[] {
//   if (!response.aggregations?.hasOwnProperty(facetID)) return [];

//   const buckets = response.aggregations[facetID][facetID]["buckets"];
//   return buckets == null ? [] : buckets;
// }

// flatten a bucket, extracting the top_hits label if present
function flattenBucket(bucket: any, labelField?: string): Bucket {
  let name: string | undefined;

  if (labelField && bucket.label?.hits?.hits?.length) {
    let source = bucket.label.hits.hits[0]._source;

    // Split nested path, e.g. "actor.name" or "criterion.name"
    const parts = labelField.split(".");
    for (const part of parts) {
      if (source == null) break;
      source = source[part];
    }

    // Only assign if we actually found a value
    if (source != null) name = source.toString();
  }

  return {
    key: bucket.key,
    doc_count: bucket.doc_count,
    name,
  };
}

// get the raw buckets from ES response
export function getBuckets(response: any, facetID: string): any[] {
  if (!response.aggregations?.[facetID]?.[facetID]?.buckets) return [];
  return response.aggregations[facetID][facetID].buckets;
}

// export function getBuckets(response: any, facet: any): Bucket[] {
//   if (!response.aggregations?.hasOwnProperty(facet.ID)) return [];

//   const buckets = response.aggregations[facet.ID][facet.ID]["buckets"];
//   if (buckets == null) return [];

//   console.log(response)

//   // If this facet had a labelField, unwrap it
//   if (facet.labelField) {
//     return buckets.map((b: any) => {
//       let name: string | undefined;
//       const hit = b.label?.hits?.hits?.[0]?._source;
//       if (hit) {
//         // unwrap nested field safely, e.g. "actor.name"
//         const parts = facet.labelField.split(".");
//         name = parts.reduce((acc: any, part: string) => acc?.[part], hit);
//       }
//       return {
//         key: b.key,
//         doc_count: b.doc_count,
//         name,
//       };
//     });
//   }

//   return buckets;
// }

export function ESResponseWithFacetsParser(
  response: ElasticSearchResponse,
  controllers: FacetControllers,
): [FSResponse, Record<string, any>] {
  const facetValues: Record<string, any> = {};

  // for (const facet of controllers.values()) {
  //   let buckets = getBuckets(response, facet.ID);
  //   facetValues[facet.ID] = facet.responseParser(buckets, response);
  // }

  for (const facet of controllers.values()) {
    const rawBuckets = getBuckets(response, facet.ID);
    const flattenedBuckets = rawBuckets.map(b => flattenBucket(b, facet.config.labelField));

    console.log(flattenedBuckets);
    console.log(facet.responseParser);

    facetValues[facet.ID] = facet.responseParser
      ? facet.responseParser(flattenedBuckets, response)
      : flattenedBuckets;
  }

  const results = ESResponseParser(response);

  console.log(facetValues)
  return [results, facetValues];
}
