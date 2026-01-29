import { SearchProvider } from "@elastic/react-search-ui";
import ElasticSearch from "./ElasticSearch";
import { getSearchFilters, type SearchState, setResultViewConfig } from "./redux/slices";
import { useStoreHooks } from "@dans-framework/shared-store";
import { convertToESUIConfig, ESUIFacet, type SimpleConfig } from "./utils/configConverter";
import connector from "./utils/esConnector";

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

  // Combine stock and custom facets into a single sorted array
  const combinedFacetsArray: [string, ESUIFacet][] = [
    ...Object.entries(esUIConfig.config.searchQuery.facets),
    ...Object.entries(esUIConfig.config.searchQuery.externallyHandledFacets || {}),
  ].sort(([, a], [, b]) => a.order - b.order);
    
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
        facets={combinedFacetsArray} 
        dashRoute={dashRoute} 
        resultRoute={resultRoute} 
      />
    </SearchProvider>
  )
}