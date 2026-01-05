export const config = {
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  searchQuery: {
    filters: [],
    search_fields: {
      title: {
        weight: 3
      },
      dc_description: {},
    },
    result_fields: {
      pathways: { raw: {} },
      dc_date: { raw: {} },
      individuals: { raw: {} },
      workflows: { raw: {} },
      subjects: { raw: {} },
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      related_institutions: { raw: {} },
      working_groups: { raw: {} },
      interest_groups: { raw: {} },
      resource_source: { raw: {} },
      dc_description: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    },
    disjunctiveFacets: [
      "dc_date",
    ],
    facets: {
      "pathways.pathway.keyword": { type: "value" },
      "individuals.fullName.keyword": { type: "value" },
      "workflows.WorkflowState.keyword": { type: "value" },
      "subjects.keyword.keyword": { type: "value" },
      "related_institutions.english_name.keyword": { type: "value" },
      "working_groups.title.keyword": { type: "value" },
      "interest_groups.title.keyword": { type: "value" },
      "resource_source.keyword": { type: "value" },
    }
  },
  autocompleteQuery: {
    results: {
      search_fields: {
        search_as_you_type: {}
      },
      resultsPerPage: 5,
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["dc_description"]
        }
      },
      size: 4
    }
  }
};

export const sortOptions = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Title",
    value: [
      {
        field: "title.keyword",
        direction: "asc"
      }
    ]
  },
  {
    name: "Individuals",
    value: [
      {
        field: "individuals.fullName.keyword",
        direction: "asc"
      }
    ]
  },
];