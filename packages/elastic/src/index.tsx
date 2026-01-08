import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchProvider } from "@elastic/react-search-ui";
import ElasticSearch from "./ElasticSearch";
import { getSearchFilters, type SearchState } from "./redux/slices";
import { useStoreHooks } from "@dans-framework/shared-store";

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
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
  console.log(savedSearchFilters)

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