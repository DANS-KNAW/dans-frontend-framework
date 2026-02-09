import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "identifier.keyword", weight: 3 },
    { field: "description" },
    { field: "individuals" },
  ],
  
  facets: [
    {
      field: "countries.name",
      type: "barchart",
      label: { en: "Recommended/endorsed by", nl: "Aanbevolen/goedgekeurd door" },
      initialSize: 100,
      orientation: "horizontal",
      legend: false,
      tooltip: "Use this to filter countries or regions that have endorsed or recommended a specific Identifier. These recommendations are usually contained in RDA national strategy documents, and/ or in published national strategies or policies."
    },
    {
      field: "countries.location", 
      type: "geomap",
      label: { en: "Recommended/Endorsed By", nl: "Aanbevolen/Goedgekeurd Door" },
      initialSize: 100,
      width: "large",
    },
    {
      field: "entity",
      type: "piechart",
      label: { en: "Referenced Entity", nl: "Gerefereerde Entiteit" },
      initialSize: 10,
    },
    {
      field: "start_date",
      type: "timerange",
      label: { en: "Year of First Use", nl: "Jaar van Eerste Gebruik" },
      interval: "year",
      start: 1893,
      end: "now",
      width: "large",
      initialSize: 200,
      showEmptyBuckets: true,
    },
    {
      field: "scheme",
      type: "list",
      label: { en: "Scheme", nl: "Schema" },
      initialSize: 10,
      maxSize: 10000,
      tooltip: "Many Identifiers are based on a Scheme, and the Scheme is sometimes standardised or based on an existing Standard.</p><p>For example, many Identifiers are based on the Digital Object identifier scheme (DOI), which in turn is a special case of the Handle System scheme. Or, both ORCIDs and URN:ISNI are based on the International Standard Name Identifier scheme."
    },
    {
      field: "standard",
      type: "list",
      label: { en: "Standard", nl: "Standaard" },
      initialSize: 10,
      maxSize: 10000,
    },
    {
      field: "identifier",
      type: "hidden",
    },
  ],
  
  sortOptions: [
    { field: null, label: "Relevance" }, // null = default relevance
    { field: "identifier", label: "Identifier", direction: "asc" },
  ],

  searchResult: {
    title: "identifier",
    subTitle: "start_date",
    description: "description",
  },

};