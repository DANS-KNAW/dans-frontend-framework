import {
  PieChartFacet,
  ListFacet,
  DateChartFacet,
  MapFacet,
  type EndpointProps,
  type RDTSearchUIProps,
  SortBy,
  SortDirection,
} from "@dans-framework/rdt-search-ui";

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
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: SingleResult,
    onClickResultPath: "identifier",
    customColumns: 12,
    dashboard: [
      <ListFacet
        config={{
          id: "identifier",
          field: "identifier.normalized",
          fieldLabel: "identifier",
          title: "Identifier",
          sort: {
            by: SortBy.Key,	
            direction: SortDirection.Asc,
          },
          cols: 3,
          rows: 1,
          tooltip: "Use this to filter the dashboard or the searchable listing for the entities being referenced by the Identifier. Some Identifiers are entity-specific, but many are aimed at a variety of entities or are entity-agnostic.",
        }}
      />,
      <PieChartFacet
        config={{
          id: "countries",
          field: "countries.name",
          title:  "Recommended/Endorsed By",
          cols: 3,
          rows: 1,
          chartType: "bar",
          tooltip: "Use this to filter countries or regions that have endorsed or recommended a specific Identifier. These recommendations are usually contained in RDA national strategy documents, and/ or in published national strategies or policies.",
        }}
      />,
      <MapFacet
        config={{
          id: "countriesMap",
          field: "countries.location",
          title:  "Recommended/Endorsed By",
          cols: 6,
          rows: 1,
          tooltip: "This is an alternative view to zoom in to countries or regions that have endorsed or recommended a specific Identifier.",
          disableSort: true,
        }}
      />,
      <DateChartFacet
        config={{
          id: "start_date",
          field: "start_date",
          title:  "Year of First Use",
          interval: "year",
          cols: 9,
          rows: 1,
          tooltip: "The facet shows the year of first use of a persistent identifier. The facet shows the year of first use of a persistent identifier. Hover over the bars to see detail, and click to use as a filter. Some identifiers precede the digital age and were converted to digital services afterwards.",
        }}
      />,
      <PieChartFacet
        config={{
          id: "resolutionTopology",
          field: "resolution_topology",
          title: "Resolution Topology",
          cols: 4,
          rows: 1,
          tooltip: "The Resolution Topology indicates how Identifiers are resolved.<ul><li><strong>Discontinued:</strong> does not resolve anymore</li><li><strong>Distributed:</strong> Many resolution nodes exist, all with the same information (blockchain-like)</li><li><strong>Federated:</strong> Many resolution nodes exist, but they resolve only their own scope (for example URN:NBN)</li><li><strong>Cascading:</strong> A central entry point exists for resolution, but additional metadata and actions can be obtained by redirecting to lower-level resolvers in a hierarchy (for example DOIs and ePICS).</li><li><strong>Centralised:</strong> all Identifiers are resolved at a central point (for example ORCIDs).</li></ul>",
          legend: true,
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
          chartOptions: {
            xAxis: {
              type: "log",
            },
          },
          tooltip: "<p>Identifiers often rely on Managers to assist owners of digital objects, physical objects, or concepts to create and maintain a PID for the resource. This facet provides a view of the number of Managers involved in provision of Identifiers. As an example, DataCite and CrossRef support more than 3,000 Managers each for this purpose. These Managers are more often than not the repositories used to publish and preserve outputs.</p><p>For most Identifiers, though, the role of Manager is taken up by the Provider directly.</p>"
        }}
      />,
    ],
  },
];

function SingleResult() {
    return (
        <div>
            <h2>Single Result Component</h2>
            <p>This is a placeholder for the single result component.</p>
        </div>
    );
};