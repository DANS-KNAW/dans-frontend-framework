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
      "dc_date": { 
        type: "value", 
        label: { 
          en: "Date", 
          nl: "Datum" 
        },
        display: "list",
      },
      "pathways.pathway.keyword": { 
        type: "value",
        label: { 
          en: "Pathways", 
          nl: "Paden" 
        },
        display: "list",
        filterType: "any",
      },
      "individuals.fullName.keyword": { 
        type: "value",
        label: { 
          en: "Name", 
          nl: "Naam" 
        },
        display: "list",
      },
      "workflows.WorkflowState.keyword": { 
        type: "value",
        label: { 
          en: "Workflow State", 
          nl: "Workflow Status" 
        },
        display: "list",
      },
      "subjects.keyword.keyword": { 
        type: "value",
        label: { 
          en: "Subjects", 
          nl: "Onderwerpen" 
        },
        display: "list",
      },
      "related_institutions.english_name.keyword": { 
        type: "value",
        label: { 
          en: "Related Institutions", 
          nl: "Gerelateerde Instellingen" 
        },
        display: "list",
      },
      "working_groups.title.keyword": { 
        type: "value",
        label: { 
          en: "Working Groups", 
          nl: "Werkgroepen" 
        },
        display: "list",
      },
      "interest_groups.title.keyword": { 
        type: "value",
        label: { 
          en: "Interest Groups", 
          nl: "Belangengroepen" 
        },
        display: "list",
      },
      "resource_source.keyword": { 
        type: "value",
        label: {
          en: "Resource Source",
          nl: "Bron van Middelen"
        },
        display: "list",
      },
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