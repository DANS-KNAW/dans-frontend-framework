import {
  PieChartFacet,
  ListFacet,
  type EndpointProps,
  type RDTSearchUIProps,
  SortBy,
  SortDirection,
} from "@dans-framework/rdt-search-ui";

import { SingleResult } from './Single';

const fieldConfig: Partial<RDTSearchUIProps> = {
  fullTextFields: ["bodyguidanceelement", "descguidanceelement", "lodgde", "labelguidanceelement"],
  fullTextHighlight: {
    fields: {
      bodyguidanceelement: { number_of_fragments: 0 },
      descguidanceelement: { number_of_fragments: 0 },
      lodgde: { number_of_fragments: 0 },
      labelguidanceelement: { number_of_fragments: 0 },
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
    onClickResultPath: "guidance/identifier",
    customColumns: 12,
    resultsPerPage: 15,
    dashboard: [
      <ListFacet
        config={{
          id: "criterion",
          field: "criterion.name",
          title: "Criterion",
          sort: {
            by: SortBy.Key,	
            direction: SortDirection.Asc,
          },
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
        }}
      />,
      <ListFacet
        config={{
          id: "domain",
          field: "domain.name",
          title: "Domain",
          sort: {
            by: SortBy.Key,	
            direction: SortDirection.Asc,
          },
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
        }}
      />,
      <PieChartFacet
        config={{
          id: "focus",
          field: "focus.name",
          title:  "Focus",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          legend: true,
        }}
      />,
      <ListFacet
        config={{
          id: "motivation",
          field: "motivation.name",
          title: "Motivation",
          sort: {
            by: SortBy.Key,	
            direction: SortDirection.Asc,
          },
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
        }}
      />,
      <ListFacet
        config={{
          id: "test",
          field: "test.name",
          title: "Test",
          sort: {
            by: SortBy.Key,	
            direction: SortDirection.Asc,
          },
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
        }}
      />,
      <PieChartFacet
        config={{
          id: "actor",
          field: "actor.name",
          title:  "Actor",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          legend: true,
        }}
      />,
      <PieChartFacet
        config={{
          id: "type",
          field: "type.name",
          title:  "Type",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          chartType: "bar"
        }}
      />,
      <PieChartFacet
        config={{
          id: "source",
          field: "source.name",
          title:  "Source",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          chartType: "bar"
        }}
      />,
    ],
  },
];