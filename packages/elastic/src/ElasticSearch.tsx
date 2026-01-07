import { useSearch } from "@elastic/react-search-ui";
import {
  ErrorBoundary,
  Facet,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import Grid from "@mui/material/Grid";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import { FACET_VIEW_MAP } from "./utils/consts";
import { useRouteMatch } from "./hooks";
import { useNavigate } from "react-router-dom";
import { useStoreHooks } from "@dans-framework/shared-store";
import { type SearchState, setSearchFilters } from "./redux/slices";
import { useEffect } from "react";

export default function ElasticSearch({ 
  sortOptions, 
  facets, 
  dashRoute = "/", 
  resultRoute = "/results"
}: { 
  sortOptions?: any[]; 
  facets?: any; 
  dashRoute?: string;
  resultRoute?: string; 
}) {
  const routeMatch = useRouteMatch([dashRoute, resultRoute]);
  const navigate = useNavigate();
  const currentTab = routeMatch?.pattern?.path;
  const { useAppDispatch } = useStoreHooks<SearchState>();
  const dispatch = useAppDispatch();
  const { filters } = useSearch();

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
    <Grid container spacing={2}>
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
      <ErrorBoundary>
        {isDashboard && <ViewSelector type="dashboard" facets={facets} />}
        {isResults && <ViewSelector type="results" facets={facets} sortOptions={sortOptions} />}
      </ErrorBoundary>
    </Grid>
  );
};

function ViewSelector({ type, facets, sortOptions }: { type: string; facets: any; sortOptions?: any[] }) {
  const { wasSearched } = useSearch();
  const { i18n } = useTranslation();

  return (
    <>
      {type === "dashboard" ? (
          Object.entries(facets).map(([field, config]) => (
            <Facet
              key={field}
              field={field}
              label={lookupLanguageString(config.label, i18n.language)}
              view={FACET_VIEW_MAP[config.display]}
              isFilterable={true}
              {...(config.filterType && { filterType: config.filterType })}
            />
          ))
      ) : (
        <>
          <SearchBox
            autocompleteMinimumCharacters={3}
            autocompleteResults={{
              linkTarget: "_blank",
              sectionTitle: "Results",
              titleField: "title",
              urlField: "title",
              shouldTrackClickThrough: true,
              clickThroughTags: ["test"]
            }}
            autocompleteSuggestions={true}
            debounceLength={0}
          />
          {sortOptions && <Sorting label={"Sort by"} sortOptions={sortOptions} />}
          <Results
            titleField="title"
            shouldTrackClickThrough={true}
          />         
          <>
            {wasSearched && <PagingInfo />}
            {wasSearched && <ResultsPerPage />}
          </>
          <Paging />
        </>
      )}
    </>
  )
}