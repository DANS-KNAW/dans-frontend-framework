import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "bodyguidanceelement", weight: 3 },
    { field: "descguidanceelement" },
    { field: "lodgde" },
    { field: "labelguidanceelement" },
  ],
  
  facets: [
    {
      field: "criterion.name",
      type: "list",
      label: "Criterion",
    },
    {
      field: "domain.name",
      type: "list",
      label: "Domain",
    },
    {
      field: "focus.name",
      type: "piechart",
      label: "Focus",
    },
    {
      field: "motivation.name",
      type: "list",
      label: "Motivation",
    },
    {
      field: "test.name",
      type: "list",
      label: "Test",
    },
    {
      field: "actor.name",
      type: "piechart",
      label: "Actor",
    },
    {
      field: "type.name",
      type: "barchart",
      orientation: "horizontal",
      label: "Type",
    },
    {
      field: "source.name",
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
    tags: ["motivation.name", "actor.name"],
    description: "descguidanceelement",
    linkToSlug: "guidance/record",
    linkToId: "lodgde",
  },

};

export const esResultConfig = {
  ...esConfig.searchResult,
  list: [
    { label: "Actor", value: "actor.name" },
    { label: "Criterion", value: "criterion.name" },
    { label: "Domain", value: "domain.name" },
    { label: "Focus", value: "focus.name" },
    { label: "Motivation", value: "motivation.name" },
    { label: "Test", value: "test.name" },
    { label: "Type", value: "type.name" },
    { label: "Source", value: "source.name" },
  ],
  // chips: [
  //   { label: "Type", value: "@type" },
  // ],
};