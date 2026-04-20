import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "@id", weight: 3 },
    { field: "@type" },
    { field: "dct:title", weight: 2 },
    { field: "dct:description" },
    { field: "dcat:keyword" },
    { field: "dcat:service" },
  ],

  // Facets are category-scoped: `showWhen` controls visibility based on the
  // currently-selected _category filter. No filter → only universal facets.
  facets: [
    // ---- Universal ----
    { field: "_category.keyword", type: "list", label: "Category" },
    { field: "@type.keyword", type: "list", label: "RDF type" },

    // ---- Repository ----
    {
      field: "dct:type.keyword",
      type: "list",
      label: "Repository type",
      showWhen: (c) => !c || c === "repository",
    },
    {
      field: "dct:license.keyword",
      type: "piechart",
      label: "License",
      showWhen: (c) => c === "repository",
    },
    {
      field: "dcat:keyword.keyword",
      type: "list",
      label: "Keywords",
      initialSize: 30,
      showWhen: (c) => c === "repository",
    },
    {
      field: "_policy.keyword",
      type: "list",
      label: "Policies applied",
      showWhen: (c) => c === "repository",
    },
    // Nested facets on dct:publisher blank-node objects
    {
      field: "dct:publisher.foaf:name.keyword",
      nestedPath: "dct:publisher",
      type: "list",
      label: "Publisher",
      showWhen: (c) => c === "repository",
    },
    {
      field: "dct:publisher.vcard:country.keyword",
      nestedPath: "dct:publisher",
      type: "piechart",
      label: "Publisher country",
      showWhen: (c) => c === "repository",
    },

    // ---- Data service ----
    {
      field: "dct:conformsTo.keyword",
      type: "list",
      label: "Standard / protocol",
      showWhen: (c) => c === "data-service",
    },
    {
      field: "dct:format.keyword",
      type: "list",
      label: "Format",
      showWhen: (c) => c === "data-service",
    },
    {
      field: "_parent.keyword",
      type: "list",
      label: "Parent repository",
      showWhen: (c) => c === "data-service" || c === "policy",
    },

    // ---- Policy ----
    {
      field: "dct:title.keyword",
      type: "list",
      label: "Policy name",
      showWhen: (c) => c === "policy",
    },

    // ---- Hidden (registered for result fields, not rendered) ----
    { field: "@id.keyword", type: "hidden" },
  ],

  sortOptions: [
    { field: null, label: "Relevance" },
    { field: "_category.keyword", label: "Category" },
    { field: "dct:title.keyword", label: "Title" },
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
    { label: "Category", value: "_category" },
    { label: "RDF type", value: "@type" },
    { label: "Identifier", value: "dct:identifier" },
    { label: "Parent repository", value: "_parent" },
    { label: "Conforms to", value: "dct:conformsTo" },
    { label: "Format", value: "dct:format" },
    { label: "Endpoint URL", value: "dcat:endpointURL" },
    { label: "License", value: "dct:license" },
    { label: "Policies", value: "_policy" },
    { label: "Keywords", value: "dcat:keyword" },
    { label: "Services", value: "dcat:service" },
  ],
  chips: [{ label: "Type", value: "@type" }],
  externalLink: "@id",
};
