import { useSearch } from "@elastic/react-search-ui";
import {
  ErrorBoundary,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouteMatch } from "./hooks";
import { useNavigate } from "react-router-dom";
import { useStoreHooks } from "@dans-framework/shared-store";
import { type SearchState, setSearchFilters } from "./redux/slices";
import { useEffect } from "react";
import FacetContainer from "./ui-components/FacetContainer";
import ResultsContainer from "./results/Results";
import Result from "./results/Result";
import SortBy from "./results/Sorting";
import { PaginationAction, PaginationInfo, ResultsPerPage as ResultsPerPageView } from "./results/Pagination";
import type { ESUIFacet, ESUISortOption } from "./utils/configConverter";
import { useTranslation } from "react-i18next";
import FilterDrawer from "./ui-components/FilterDrawer";

export default function ElasticSearch({ 
  sortOptions, 
  facets, 
  dashRoute, 
  resultRoute,
}: { 
  sortOptions?: ESUISortOption[]; 
  facets: [string, ESUIFacet][];
  dashRoute?: string;
  resultRoute?: string;
}) {
  const { t } = useTranslation('elastic');
  const routeMatch = useRouteMatch([dashRoute, resultRoute]);
  const navigate = useNavigate();
  const currentTab = routeMatch?.pattern?.path || null;
  const { useAppDispatch } = useStoreHooks<SearchState>();
  const dispatch = useAppDispatch();
  const { filters } = useSearch();

  const needsTabs = dashRoute !== undefined && resultRoute !== undefined;
  const isDashboard = currentTab === dashRoute;
  const isResults = currentTab === resultRoute;

  // Save query string to Redux whenever it changes
  useEffect(() => {
    dispatch(setSearchFilters(filters));
  }, [filters, dispatch]);

  const handleTabChange = (newPath: string) => {
    // Navigate to new path with current or saved query string
    const queryString = window.location.search;
    navigate(`${newPath}${queryString}`);
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2, ml: 'auto', mr: 'auto', pl: 2, pr: 2, pb: 8 }} maxWidth="xl">
      {needsTabs && 
        <Grid size={{xs: 12}}>
          <Tabs value={currentTab} aria-label={t("switchBetweenDashboardAndResults")}>
            <Tab 
              label={t("dashboard")} 
              id="dashboard" 
              value={dashRoute} 
              onClick={() => handleTabChange(dashRoute)}
            />
            <Tab 
              label={t("results")}
              id="results" 
              value={resultRoute} 
              onClick={() => handleTabChange(resultRoute)}
            />
          </Tabs>
        </Grid> 
      }
      <ErrorBoundary>
        {isDashboard && <ViewSelector type="dashboard" facets={facets} />}
        {isResults && <ViewSelector type="results" facets={facets} sortOptions={sortOptions} />}
      </ErrorBoundary>
    </Grid>
  );
};

function ViewSelector({ 
  type, 
  facets, 
  sortOptions,
}: { 
  type: string; 
  facets: [string, ESUIFacet][];
  sortOptions?: ESUISortOption[]; 
}) {
  const { wasSearched } = useSearch();

  return (
    <>
      {type === "dashboard" ? (
        facets.map(([field, config]) => { 
          return config.display !== 'hidden' && (
            <FacetContainer key={field} field={field} config={config} />
          )
        })
      ) : (
        <>
          <FilterDrawer facets={facets} />
          <Grid size={{ md: 7, lg: 8, xl: 9 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
              {wasSearched && <PagingInfo view={PaginationInfo} />}
              {wasSearched && <ResultsPerPage view={ResultsPerPageView} />}
              {sortOptions && <Sorting sortOptions={sortOptions} view={SortBy} />}
            </Stack>
            <Results
              view={ResultsContainer}
              resultView={Result}
            />
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Paging view={PaginationAction} />
            </Stack>
          </Grid>    
        </>
      )}
    </>
  )
}