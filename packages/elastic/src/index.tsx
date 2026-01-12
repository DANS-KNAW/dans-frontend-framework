import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchProvider } from "@elastic/react-search-ui";
import ElasticSearch from "./ElasticSearch";
import { getSearchFilters, type SearchState } from "./redux/slices";
import { useStoreHooks } from "@dans-framework/shared-store";

// function buildDateHistogramAgg(field, interval) {
//   return {
//     date_histogram: {
//       field,
//       calendar_interval: interval, // "year", "month", etc.
//       format: interval === "year" ? "yyyy" : undefined,
//       min_doc_count: 0
//     }
//   };
// }

// function rewriteTimerangeFacets({ facets }, esRequest) {
//   const facetAggs = esRequest.aggs.facet_bucket_all.aggs;

//   Object.entries(facets).forEach(([facetKey, facetConfig]) => {
//     if (facetConfig.display !== "timerange") return;

//     facetAggs[facetKey] = buildDateHistogramAgg(
//       facetKey,
//       facetConfig.interval || "year"
//     );
//   });

//   return esRequest;
// }

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
  // interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
  //   console.log("queryConfig:", queryConfig);
  //   console.log("Search request:", requestBody);
  //   const rewrittenReq = rewriteTimerangeFacets(queryConfig, requestBody);
  //   const response = await next(rewrittenReq);
  //   console.log("Search response:", response);
  //   return response;
  // },
});

export default function ElasticWrapper({
  config,
  sortOptions,
  dashRoute,
  resultRoute,
} : {
  config: any;
  sortOptions?: any[];
  dashRoute?: string;
  resultRoute?: string;
}) {
  const { useAppSelector } = useStoreHooks<SearchState>();
  const savedSearchFilters = useAppSelector(getSearchFilters);

  return (
    <SearchProvider 
      config={{ 
        ...config,
        apiConnector: connector,
        initialState: {
          ...config.initialState,
          filters: savedSearchFilters,
        },
       }}
    >
      <ElasticSearch 
        sortOptions={sortOptions} 
        facets={config.searchQuery.facets} 
        dashRoute={dashRoute} 
        resultRoute={resultRoute} 
      />
    </SearchProvider>
  )
}