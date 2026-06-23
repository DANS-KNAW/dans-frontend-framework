import { type SimpleConfig } from "@dans-framework/elastic";
import { profileLabels } from "./profileLabels";

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
    { field: "_category.keyword", type: "list", label: "Category", singleSelect: true },
    { field: "@type.keyword", type: "list", label: "RDF type" },

    {
      field: "dct:type.keyword",
      type: "list",
      label: "Record type",
      showWhen: (c) => c === "repository",
    },

    {
      field: "trsp:att.4570870110.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Country",
      tooltip: "Country in which the repository is located (TRSP attribute att.4570870110)",
      showWhen: (c) => !c || c === "repository",
    },
    {
      field: "trsp:att.6A715E3A22.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Repository type",
      showWhen: (c) => !c || c === "repository",
    },
    {
      field: "trsp:att.48BF7E1522.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Year established",
      initialSize: 15,
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.27C898E8A0.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Certifications",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.394BC515E7.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "EOSC node participation",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.78CC017229.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "TRUST principles endorsed",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.6EF77F35F8.keyword",
      nestedPath: "trsp:att",
      type: "piechart",
      label: "Funding model",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.494B22C440.keyword",
      nestedPath: "trsp:att",
      type: "piechart",
      label: "Governance model",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.3B633179C5.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Research domains",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.2F993B25AD.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Persistent identifiers",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.7298144E24.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "APIs available",
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:att.241E6C58DF.keyword",
      nestedPath: "trsp:att",
      type: "list",
      label: "Memberships",
      initialSize: 15,
      showWhen: (c) => c === "repository",
    },
    {
      field: "trsp:hasApplicableProfile.keyword",
      type: "list",
      label: "KB profile",
      optionLabels: profileLabels,
      initialSize: 15,
      showWhen: (c) => c === "repository",
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
      showWhen: (c) => c === "data-service",
    },

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
    { label: "Country", value: "trsp:att.4570870110" },
    { label: "Year established", value: "trsp:att.48BF7E1522" },
    { label: "Repository type", value: "trsp:att.6A715E3A22" },
    { label: "Certifications", value: "trsp:att.27C898E8A0" },
    { label: "Funding model", value: "trsp:att.6EF77F35F8" },
    { label: "Purpose", value: "trsp:att.035ACCB10D" },
    { label: "KB profiles", value: "trsp:hasApplicableProfile" },
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
  valueLabels: {
    "trsp:hasApplicableProfile": profileLabels,
  } as Record<string, Record<string, string>>,
};
