import { useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (esUIConfig.resultsViewConfig) {
      dispatch(setResultViewConfig(esUIConfig.resultsViewConfig));
    }
  }, []);

  // Memoize the config so it doesn't change between renders
  const searchProviderConfig = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('current');
    const pageSize = urlParams.get('size');
    const hasUrlState = urlParams.toString().length > 0;

    return {
      ...esUIConfig.config,
      apiConnector: connector,
      initialState: {
        ...esUIConfig.config.initialState,
        ...(!hasUrlState && { filters: savedSearchFilters }),
        ...(currentPage && { current: parseInt(currentPage) }),
        ...(pageSize && { resultsPerPage: parseInt(pageSize) }),
      },
      trackUrlState: true,
      routingOptions: {
        readUrl: () => window.location.search,
        writeUrl: (url: string) => {
          const pathname = window.location.pathname;
          const cleanUrl = url.replace(/n_(\d+)_n/g, '$1');
          window.history.replaceState(null, "", `${pathname}?${cleanUrl}`);
        }
      }
    };
  }, []);

  // Nested facets appear in both `facets` (for normal rendering) and
  // `externallyHandledFacets` (as a registry consumed by the connector).
  // Dedupe on key so they render once — preferring the entry from `facets`.
  const facetsMap = new Map<string, ESUIFacet>();
  for (const [k, v] of Object.entries(esUIConfig.config.searchQuery.facets)) {
    facetsMap.set(k, v);
  }
  for (const [k, v] of Object.entries(
    esUIConfig.config.searchQuery.externallyHandledFacets || {},
  )) {
    if (!facetsMap.has(k)) facetsMap.set(k, v);
  }
  const combinedFacetsArray: [string, ESUIFacet][] = Array.from(
    facetsMap.entries(),
  ).sort(([, a], [, b]) => a.order - b.order);
    
  return (
    <SearchProvider config={searchProviderConfig}>
      <ElasticSearch 
        sortOptions={esUIConfig.sortOptions} 
        facets={combinedFacetsArray} 
        dashRoute={dashRoute} 
        resultRoute={resultRoute} 
      />
    </SearchProvider>
  )
}