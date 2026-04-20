import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { handleGeoFacets } from "./geoAggregations";
import { handleNestedFacets, unwrapNestedAggregations } from "./nestedAggregations";
import type { QueryConfig } from "@elastic/search-ui";
import { ESUIFacet } from "./configConverter";

interface ExtendedQueryConfig extends QueryConfig {
  externallyHandledFacets?: Record<string, ESUIFacet>;
}

// Exclude harvester-provenance docs (_category=_internal) from all search
// results and facet counts. No-op for indices without a _category field:
// `term` on a missing field matches zero docs, so must_not excludes nothing.
function excludeInternal(req: any): any {
  const existing = req.query;
  return {
    ...req,
    query: {
      bool: {
        ...(existing ? { must: [existing] } : {}),
        must_not: [{ term: { "_category.keyword": "_internal" } }],
      },
    },
  };
}

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
  interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
    let rewrittenReq = excludeInternal(requestBody);
    const externallyHandled = (queryConfig as ExtendedQueryConfig).externallyHandledFacets;
    if (externallyHandled) {
      rewrittenReq = handleGeoFacets(rewrittenReq, externallyHandled);
      rewrittenReq = handleNestedFacets(rewrittenReq, externallyHandled);
    }
    const response = await next(rewrittenReq);
    if (externallyHandled) {
      unwrapNestedAggregations(response, externallyHandled);
    }
    return response;
  },
});

export default connector;