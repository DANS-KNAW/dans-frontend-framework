import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "@id", weight: 3 },
    { field: "@type" },
    { field: "dcat:service" },
  ],
  
  facets: [
    {
      field: "@type.keyword",
      type: "list",
      label: "Type",
    },
  ],
  
  sortOptions: [
    { field: null, label: "Relevance" }, // null = default relevance
    { field: "@id", label: "Identifier", direction: "asc" },
  ],

  searchResult: {
    title: "@id",
    subTitle: "@type",
    linkToSlug: "record",
    linkToId: "@id",
  },

};

export const esResultConfig = {
  ...esConfig.searchResult,
  list: [
    { label: "Title", value: "@id" },
    { label: "Identifier", value: "dct:identifier" },
    { label: "Service", value: "dcat:service" },
  ],
  chips: [
    { label: "Type", value: "@type" },
  ],
  externalLink: "@id",
};