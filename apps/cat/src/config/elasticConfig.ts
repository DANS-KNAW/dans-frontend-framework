import { type SimpleConfig } from "@dans-framework/elastic";

export const esConfig: SimpleConfig = {
  searchFields: [
    { field: "identifier", weight: 3 },
    { field: "description" },
    { field: "individuals" },
  ],
  
  facets: [
    {
      field: "countries.name",
      type: "barchart",
      label: { en: "Recommended/endorsed by", nl: "Aanbevolen/goedgekeurd door" },
      initialSize: 30,
      orientation: "horizontal",
      legend: false,
      tooltip: "Use this to filter countries or regions that have endorsed or recommended a specific Identifier. These recommendations are usually contained in RDA national strategy documents, and/ or in published national strategies or policies."
    },
    {
      field: "countries.location",
      type: "geomap",
      label: { en: "Recommended/Endorsed By", nl: "Aanbevolen/Goedgekeurd Door" },
      initialSize: 10,
      maxSize: 10000,
      width: "large",
    },
    {
      field: "entity",
      type: "piechart",
      label: { en: "Referenced Entity", nl: "Gerefereerde Entiteit" },
      initialSize: 10,
      maxSize: 10000,
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
    },
    // {
    //   field: "start_date",
    //   type: "date",
    //   label: { en: "Year of First Use", nl: "Jaar van Eerste Gebruik" },
    //   interval: "year",
    //   width: "large",
    //   initialSize: 200,
    // },
  ],
  
  sortOptions: [
    { field: null, label: "Relevance" }, // null = default relevance
    { field: "identifier.normalized", label: "Identifier", direction: "asc" },
  ],

  searchResult: {
    title: "identifier",
    subTitle: "start_date",
    description: "description",
  },

};