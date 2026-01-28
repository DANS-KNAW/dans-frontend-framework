import { useSearch } from "@elastic/react-search-ui";
import {
  ErrorBoundary,
  SearchBox,
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
import SearchBoxView from "./results/SearchBox";
import Result from "./results/Result";
import SortBy from "./results/Sorting";
import { PaginationAction, PaginationInfo, ResultsPerPage as ResultsPerPageView } from "./results/Pagination";
import type { ESUIFacet, ESUISortOption } from "./utils/configConverter";

export default function ElasticSearch({ 
  sortOptions, 
  facets, 
  dashRoute, 
  resultRoute,
  externallyHandledFacets,
}: { 
  sortOptions?: ESUISortOption[]; 
  facets: Record<string, ESUIFacet>; 
  dashRoute?: string;
  resultRoute?: string;
  externallyHandledFacets?: ESUIFacet[];
}) {
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
    <Grid container spacing={2} sx={{ mt: 2, ml: 'auto', mr: 'auto', pl: 2, pr: 2 }} maxWidth="xl">
      {needsTabs && 
        <Grid size={{xs: 12}}>
          <Tabs value={currentTab} aria-label="Switch between dashboard and results">
            <Tab 
              label="Dashboard" 
              id="dashboard" 
              value={dashRoute} 
              onClick={() => handleTabChange(dashRoute)}
            />
            <Tab 
              label="Results"
              id="results" 
              value={resultRoute} 
              onClick={() => handleTabChange(resultRoute)}
            />
          </Tabs>
        </Grid> 
      }
      <ErrorBoundary>
        {isDashboard && <ViewSelector type="dashboard" facets={facets} externallyHandledFacets={externallyHandledFacets} />}
        {isResults && <ViewSelector type="results" facets={facets} sortOptions={sortOptions} externallyHandledFacets={externallyHandledFacets} />}
      </ErrorBoundary>
    </Grid>
  );
};

function ViewSelector({ 
  type, 
  facets, 
  sortOptions,
  externallyHandledFacets,
}: { 
  type: string; 
  facets: Record<string, ESUIFacet>; 
  sortOptions?: ESUISortOption[]; 
  externallyHandledFacets?: ESUIFacet[];
}) {
  const { wasSearched } = useSearch();

  const combinedFacets = {
    ...facets,
    ...externallyHandledFacets
  };

  return (
    <>
      {type === "dashboard" ? (
        Object.entries(combinedFacets).map(([field, config]) => { 
          return config.display !== 'hidden' && (
            <FacetContainer key={field} field={field} config={config} />
          )
        })
      ) : (
        <>
          <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }}>
            <SearchBox
              // autocompleteMinimumCharacters={3}
              // autocompleteResults={{
              //   linkTarget: "_blank",
              //   sectionTitle: "Results",
              //   titleField: "title",
              //   urlField: "title",
              //   shouldTrackClickThrough: true,
              //   clickThroughTags: ["test"]
              // }}
              searchAsYouType={true}
              debounceLength={300}
              view={SearchBoxView}
            />
            {Object.entries(combinedFacets).map(([field, config]) => { 
              return config.display !== 'hidden' && (
                <FacetContainer key={field} field={field} config={config} fullWidth />
              )
            })}
          </Grid>
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