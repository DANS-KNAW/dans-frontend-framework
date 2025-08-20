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
  fullTextFields: ["bodyguidanceelement", "descguidanceelement"],
  fullTextHighlight: {
    fields: {
      bodyguidanceelement: { number_of_fragments: 0 },
      descguidanceelement: { number_of_fragments: 0 },
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
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: SingleResult,
    onClickResultPath: "guidance/identifier",
    customColumns: 12,
    dashboard: [
      <ListFacet
        config={{
          id: "domain",
          field: "domain",
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
          id: "actor",
          field: "actor",
          title:  "Actor",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          legend: true,
        }}
      />,
      <PieChartFacet
        config={{
          id: "motivation",
          field: "motivation",
          title:  "Motivation",
          cols: 3,
          rows: 1,
          tooltip: "Tooltip",
          chartType: "bar"
        }}
      />,
    ],
  },
];