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
              />
              <Facet
                field="individuals.fullName.keyword"
                label="Individuals"
              />
              <Facet
                field="workflows.WorkflowState.keyword"
                label="Workflows"
              />
              <Facet
                field="subjects.keyword.keyword"
                label="Subjects"
              />
              <Facet field="related_institutions.english_name.keyword" label="Related Institutions" filterType="any" />
              <Facet field="working_groups.title.keyword" label="Working Groups" />
              <Facet field="interest_groups.title.keyword" label="Interest Groups" />
              <Facet field="resource_source.keyword" label="Resource Source" />
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