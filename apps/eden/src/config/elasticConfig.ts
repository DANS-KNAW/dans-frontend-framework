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
    { label: "DCT Identifier", value: "dct:identifier" },
    { label: "DCT conforms to", value: "dct:conformsTo" },
    { label: "DCT format", value: "dct:format" },
    { label: "DCAT Service", value: "dcat:service" },
    { label: "DCAT endpoint URL", value: "dcat:endpointURL" },
  ],
  chips: [
    { label: "Type", value: "@type" },
  ],
  externalLink: "@id",
};