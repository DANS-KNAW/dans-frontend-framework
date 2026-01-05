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

import {
  Layout,
} from "@elastic/react-search-ui-views";

import CheckboxFacet from "./facets/Checkbox";

export default function ElasticSearch({ sortOptions }: { sortOptions?: any[] }) {
  const { wasSearched } = useSearch();
  return (
    <div className="App">
      <ErrorBoundary>
        <Layout
          header={
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
          }
          sideContent={
            <div>
              {wasSearched && (
                <Sorting label={"Sort by"} sortOptions={sortOptions} />
              )}
              <Facet
                field="pathways.pathway.keyword"
                label="Pathways"
                view={CheckboxFacet}
                filterType="any"
              />
              <Facet
                field="individuals.fullName.keyword"
                label="Individuals"
                view={CheckboxFacet}
              />
              <Facet
                field="workflows.WorkflowState.keyword"
                label="Workflows"
                view={CheckboxFacet}
              />
              <Facet
                field="subjects.keyword.keyword"
                label="Subjects"
                view={CheckboxFacet}
              />
              <Facet 
                field="related_institutions.english_name.keyword" 
                label="Related Institutions" 
                filterType="any" 
                view={CheckboxFacet} 
              />
              <Facet 
                field="working_groups.title.keyword" 
                label="Working Groups" 
                view={CheckboxFacet} 
              />
              <Facet 
                field="interest_groups.title.keyword" 
                label="Interest Groups" 
                view={CheckboxFacet} 
              />
              <Facet 
                field="resource_source.keyword" 
                label="Resource Source" 
                view={CheckboxFacet} 
              />
            </div>
          }
          bodyContent={
            <Results
              titleField="title"
              shouldTrackClickThrough={true}
            />
          }
          bodyHeader={
            <>
              {wasSearched && <PagingInfo />}
              {wasSearched && <ResultsPerPage />}
            </>
          }
          bodyFooter={<Paging />}
        />
      </ErrorBoundary>
    </div>
  );
};