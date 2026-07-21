import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "bodyguidanceelement", weight: 3 },
    { field: "test" },
    { field: "lodgde" },
    { field: "labelguidanceelement" },
  ],
  
  facets: [
    {
      field: "criterion",
      type: "list",
      label: "Criterion",
    },
    {
      field: "domain",
      type: "list",
      label: "Domain",
    },
    {
      field: "focus",
      type: "piechart",
      label: "Focus",
    },
    {
      field: "motivation",
      type: "list",
      label: "Motivation",
    },
    {
      field: "test",
      type: "list",
      label: "Test",
    },
    {
      field: "actor",
      type: "piechart",
      label: "Actor",
    },
    {
      field: "type",
      type: "barchart",
      orientation: "horizontal",
      label: "Type",
    },
    {
      field: "source",
      type: "barchart",
      orientation: "horizontal",
      label: "Source",
    },
  ],
  
  sortOptions: [
    { field: null, label: "Relevance" }, // null = default relevance
  ],

  searchResult: {
    title: "labelguidanceelement",
    tags: ["motivation", "actor"],
    description: "bodyguidanceelement",
    linkToSlug: "guidance/record",
    linkToId: "lodgde",
  },

};

export const esResultConfig = {
  ...esConfig.searchResult,
  list: [
    { label: "Guidance Element", value: "bodyguidanceelement" },
    { label: "Guidance Type", value: "type" },
    { label: "Criterion/Principle", value: "criterion" },
    { label: "Domain", value: "domain" },
    { label: "Focus Area", value: "focus" },
    { label: "Motivation", value: "motivation" },
    { label: "Associated Test", value: "test" },    
    { label: "Guidance Resource", value: "source" },
    { label: "Acting On", value: "actor" },
    { label: "Persitent Identifier", value: "lodgde" },
  ],
  // chips: [
  //   { label: "Type", value: "@type" },
  // ],
};