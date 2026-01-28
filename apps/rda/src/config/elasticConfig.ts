import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "title", weight: 3 },
    { field: "dc_description" },
    { field: "individuals" },
  ],
  
  facets: [
    {
      field: "pathways.pathway.keyword",
      type: "list",
      label: { en: "Pathways", nl: "Paden" },
      disjunctive: true,
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "dc_date",
      type: "timerange",
      label: { en: "Date", nl: "Datum" },
      disjunctive: true,
      interval: "year",
      start: 2012,
      end: "now",
      width: "large",
      initialSize: 30,
    },
    {
      field: "individuals.fullName.keyword",
      type: "list",
      label: { en: "Name", nl: "Naam" },
      disjunctive: true,
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "workflows.WorkflowState.keyword",
      type: "piechart",
      label: { en: "Workflow State", nl: "Workflow Status" },
      disjunctive: true,
      width: "medium",
      initialSize: 10,
    },
    {
      field: "subjects.keyword.keyword",
      type: "piechart",
      label: { en: "Subjects", nl: "Onderwerpen" },
      disjunctive: true,
      width: "medium",
      initialSize: 10,
    },
    {
      field: "related_institutions.english_name.keyword",
      type: "list",
      label: { en: "Related Institutions", nl: "Gerelateerde Instellingen" },
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "working_groups.title.keyword",
      type: "list",
      label: { en: "Working Groups", nl: "Werkgroepen" },
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "interest_groups.title.keyword",
      type: "list",
      label: { en: "Interest Groups", nl: "Belangengroepen" },
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "resource_source.keyword",
      type: "list",
      label: { en: "Resource Source", nl: "Bron van Middelen" },
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "dc_language.keyword",
      maxSize: 1000,
      type: "hidden",
    },
    {
      field: "rights.description.keyword",
      maxSize: 1000,
      type: "hidden",
    },
  ],
  
  sortOptions: [
    { field: null, label: "Relevance" }, // null = default relevance
    { field: "title.keyword", label: "Title", direction: "asc" },
    { field: "individuals.fullName.keyword", label: "Individuals", direction: "asc" },
  ],

  searchResult: {
    title: "title",
    subTitle: "dc_date",
    description: "dc_description",
    list: [
      { field: "dc_language", label: "Language" },
      { field: "individuals.fullName", label: "Individuals" },
      { field: "rights.description", label: "Rights" },
      { field: "workflows.WorkflowState", label: "Workflow State" },
      { field: "pathways.pathway", label: "Pathways" },
    ]
  },

};