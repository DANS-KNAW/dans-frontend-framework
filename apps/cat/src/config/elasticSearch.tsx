import {
  PieChartFacet,
  ListFacet,
  DateChartFacet,
  MapFacet,
  type EndpointProps,
  type RDTSearchUIProps,
} from "@dans-framework/rdt-search-ui";
import { SingleResult } from "../pages/search/result";

const fieldConfig: Partial<RDTSearchUIProps> = {
  fullTextFields: ["description", "label"],
  fullTextHighlight: {
    fields: {
      description: { number_of_fragments: 0 },
      label: { number_of_fragments: 0 },
    },
  },
};

/*
 * Note that for the dashboard config, we use cols and rows, based on an 8 col grid.
 * The config is for larger screens. For mobile, we use half width and full width cols.
 */

export const elasticConfig: EndpointProps[] = [
  {
    name: "CAT Catalogue",
    url: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
    user: import.meta.env.VITE_ELASTICSEARCH_API_USER,
    pass: import.meta.env.VITE_ELASTICSEARCH_API_PASS,
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: SingleResult,
    onClickResultPath: "record",
    customColumns: 12,
    dashboard: [
      <ListFacet
        config={{
          id: "entity",
          field: "entity",
          title: "Entity",
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "countries",
          field: "countries.name",
          title:  "Country",
          cols: 3,
          rows: 1,
          chartType: "bar",
        }}
      />,
      <MapFacet
        config={{
          id: "countriesMap",
          field: "countries.location",
          title:  "Map",
          cols: 6,
          rows: 1,
        }}
      />,
      <DateChartFacet
        config={{
          id: "start_date",
          field: "start_date",
          title:  "Year published",
          interval: "year",
          cols: 12,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "resolutionTopology",
          field: "resolution_topology",
          title: "Resolution Topology",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "numberOfResolvers",
          field: "number_of_resolvers",
          title: "Number of Resolvers",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "metaResolvers",
          field: "metaresovers",
          title: "Meta Resolvers",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "namespaceType",
          field: "namespace_type",
          title: "Namespace Type",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "persistent",
          field: "persistent",
          title: "Persistent",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "unique",
          field: "unique",
          title: "Unique",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "managers",
          field: "managers",
          title: "Managers",
          groupByLabel: "identifier",
          cols: 12,
          rows: 1,
          chartType: "bar",
        }}
      />,
      <ListFacet
        config={{
          id: "authority",
          field: "provider",
          title: "Authority",
          cols: 4,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "scheme",
          field: "scheme",
          title: "Scheme",
          cols: 4,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "standard",
          field: "standard",
          title: "Standard",
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "spatialCoverage",
          field: "coverage",
          title: "Spatial Coverage",
          cols: 6,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "disciplineCoverage",
          field: "disciplinary",
          title: "Discipline Coverage",
          cols: 6,
          rows: 1,
          chartType: "bar",
        }}
      />,
    ],
  },
];
