import { yearFormatter } from "@dans-framework/elastic";

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
      individuals: {},
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
      "pathways.pathway.keyword",
      "individuals.fullName.keyword",
      "dc_date",
      "workflows.WorkflowState.keyword",
      "subjects.keyword.keyword"
    ],
    facets: {
      "pathways.pathway.keyword": { 
        type: "value",
        label: { 
          en: "Pathways", 
          nl: "Paden" 
        },
        display: "list",
      },
      "dc_date": { 
        type: "range", 
        ranges: yearFormatter(2012, "now"), 
        label: { 
          en: "Date", 
          nl: "Datum" 
        },
        display: "timerange",
        interval: "year",
        width: "large",
        size: 30,
      },
      "individuals.fullName.keyword": { 
        type: "value",
        label: { 
          en: "Name", 
          nl: "Naam" 
        },
        display: "list",
        size: 10000,
      },
      "workflows.WorkflowState.keyword": { 
        type: "value",
        label: { 
          en: "Workflow State", 
          nl: "Workflow Status" 
        },
        display: "piechart",
        width: "medium",
        size: 100,
      },
      "subjects.keyword.keyword": { 
        type: "value",
        label: { 
          en: "Subjects", 
          nl: "Onderwerpen" 
        },
        display: "piechart",
        width: "medium",
        size: 100,
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
      fuzziness: true,
      resultsPerPage: 5,
      result_fields: {
        // Add snippet highlighting within autocomplete suggestions
        title: { snippet: { size: 100, fallback: true }},
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["title", "dc_description"]
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