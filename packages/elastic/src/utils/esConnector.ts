import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { handleGeoFacets } from "./geoAggregations";
import type { QueryConfig } from "@elastic/search-ui";
import { ESUIFacet } from "./configConverter";

interface ExtendedQueryConfig extends QueryConfig {
  externallyHandledFacets?: Record<string, ESUIFacet>;
}

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
  interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
    let rewrittenReq = requestBody;
    if (queryConfig.hasOwnProperty('externallyHandledFacets')) {
      rewrittenReq = handleGeoFacets(rewrittenReq, (queryConfig as ExtendedQueryConfig).externallyHandledFacets);
    }    
    const response = await next(rewrittenReq);
    return response;
  },
});

export default connector;