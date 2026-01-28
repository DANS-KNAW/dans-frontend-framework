import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchProvider } from "@elastic/react-search-ui";
import ElasticSearch from "./ElasticSearch";
import { getSearchFilters, type SearchState, setResultViewConfig } from "./redux/slices";
import { useStoreHooks } from "@dans-framework/shared-store";
import { convertToESUIConfig, type SimpleConfig } from "./utils/configConverter";

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

function addGeomapAggregations(esRequest, externallyHandledFacets) {
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

function fixGeoBoundingBoxFilters(esRequest) {
  if (!esRequest.query?.bool?.filter) return esRequest;

  // Find and replace term filters that should be geo_bounding_box
  esRequest.query.bool.filter = esRequest.query.bool.filter.map(filterItem => {
    if (filterItem.bool?.filter) {
      filterItem.bool.filter = filterItem.bool.filter.map(innerFilter => {
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

// const connector = new ElasticsearchAPIConnector({
//   host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
//   index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
//   // interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
//   //   console.log("queryConfig:", queryConfig);
//   //   console.log("Search request:", requestBody);
//   //   const rewrittenReq = rewriteTimerangeFacets(queryConfig, requestBody);
//   //   const response = await next(rewrittenReq);
//   //   console.log("Search response:", response);
//   //   return response;
//   // },
// });

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
  interceptSearchRequest: async ({ requestBody, queryConfig }, next) => {
    console.log("Original request:", JSON.stringify(requestBody, null, 2));
    
    // Add geomap aggregations
    let rewrittenReq = addGeomapAggregations(requestBody, queryConfig.externallyHandledFacets);
    
    // Fix geo bounding box filters
    rewrittenReq = fixGeoBoundingBoxFilters(rewrittenReq);
    
    console.log("Rewritten request:", JSON.stringify(rewrittenReq, null, 2));
    
    const response = await next(rewrittenReq);
    console.log("Search response:", response);
    return response;
  },
});

export default function ElasticWrapper({
  config,
  dashRoute,
  resultRoute,
} : {
  config: SimpleConfig;
  dashRoute?: string;
  resultRoute?: string;
}) {
  const { useAppSelector, useAppDispatch } = useStoreHooks<SearchState>();
  const savedSearchFilters = useAppSelector(getSearchFilters);
  const esUIConfig = convertToESUIConfig(config);
  const dispatch = useAppDispatch();

  if (esUIConfig.resultsViewConfig) {
    dispatch(setResultViewConfig(esUIConfig.resultsViewConfig));
  }

  console.log(esUIConfig)

  return (
    <SearchProvider 
      config={{ 
        ...esUIConfig.config,
        apiConnector: connector,
        initialState: {
          ...esUIConfig.config.initialState,
          filters: savedSearchFilters,
        },
        trackUrlState: true,
        routingOptions: {
          readUrl: () => {
            return window.location.search;
          },
          writeUrl: (url: string) => {
            const pathname = window.location.pathname;
            window.history.replaceState(null, "", `${pathname}?${url}`);
          }
        }
       }}
    >
      <ElasticSearch 
        sortOptions={esUIConfig.sortOptions} 
        facets={esUIConfig.config.searchQuery.facets} 
        dashRoute={dashRoute} 
        resultRoute={resultRoute} 
        externallyHandledFacets={esUIConfig.config.searchQuery.externallyHandledFacets}
      />
    </SearchProvider>
  )
}