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
    {
      field: "dct:conformsTo.keyword",
      type: "piechart",
      label: "DCT Conforms To",
      initialSize: 20,
    },
    {
      field: "dct:format.keyword",
      type: "piechart",
      label: "DCT Format",
    },
    {
      field: "dct:title.keyword",
      type: "hidden",
    },
  ],
  
  sortOptions: [
    { field: "dct:title.keyword", label: "Title" },
    { field: null, label: "Relevance" }, // null = default relevance
    { field: "@id.keyword", label: "Identifier" },
  ],

  searchResult: {
    title: "dct:title",
    tags: ["@type"],
    linkToSlug: "record",
    linkToId: "@id",
  },

};

export const esResultConfig = {
  ...esConfig.searchResult,
  list: [
    { label: "DCT Identifier", value: "dct:identifier" },
    { label: "DCT conforms to", value: "dct:conformsTo" },
    { label: "DCT format", value: "dct:format" },
    { label: "DCAT Service", value: "dcat:service" },
    { label: "DCAT endpoint URL", value: "dcat:endpointURL" },
    { label: "DCAT endpoint URL", value: "dcat:endpointURL" },
  ],
  chips: [
    { label: "Type", value: "@type" },
  ],
  externalLink: "@id",
};