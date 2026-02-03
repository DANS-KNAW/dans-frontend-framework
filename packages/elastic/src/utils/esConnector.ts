import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { handleGeoFacets } from "./geoAggregations";
import type { QueryConfig } from "@elastic/search-ui";
import { ESUIFacet } from "./configConverter";
import { handleDateFacets } from "./dateAggregations";

interface ExtendedQueryConfig extends QueryConfig {
  externallyHandledFacets?: Record<string, ESUIFacet>;
}

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
  interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
    let rewrittenReq = requestBody;
    if (queryConfig.hasOwnProperty('externallyHandledFacets')) {
      rewrittenReq = handleDateFacets(rewrittenReq, (queryConfig as ExtendedQueryConfig).externallyHandledFacets);
      rewrittenReq = handleGeoFacets(rewrittenReq, (queryConfig as ExtendedQueryConfig).externallyHandledFacets);
    }

    // console.log('FINAL REQUEST TO ES:', JSON.stringify(rewrittenReq, null, 2));
    
    const response = await next(rewrittenReq);
    
    // console.log('Response aggregations:', JSON.stringify(response.aggregations, null, 2));
    return response;
  },
});

export default connector;