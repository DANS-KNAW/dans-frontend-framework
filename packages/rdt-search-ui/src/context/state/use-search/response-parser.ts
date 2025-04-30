import type { ElasticSearchResponse, FSResponse, Result } from "./types";

export function ESResponseParser(response: ElasticSearchResponse): FSResponse {
  return {
    results: response.hits.hits.map(
      (hit: any): Result => ({
        id: hit._id,
        highlight: hit.highlight,
        ...hit._source,
      }),
    ),
    total: response.hits.total?.value || 0,
  };
}
