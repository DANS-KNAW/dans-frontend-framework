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
      <ListFacet
        config={{
          id: "entity",
          field: "entity",
          title: "Referenced Entity",
          cols: 3,
          rows: 1,
          tooltip: "Use this to filter the dashboard or the searchable listing for the entities being referenced by the Identifier. Some Identifiers are entity-specific, but many are aimed at a variety of entities or are entity-agnostic.",
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
          id: "numberOfResolvers",
          field: "number_of_resolvers",
          title: "Number of Resolvers",
          cols: 4,
          rows: 1,
          tooltip: "Some identifiers offer many resolver endpoints, but the vast majority offer only one."
        }}
      />,
      <PieChartFacet
        config={{
          id: "metaResolvers",
          field: "metaresolvers",
          title: "Meta Resolvers",
          cols: 4,
          rows: 1,
          tooltip: "Metaresolvers are public resources that assist end users with resolution of any one of a number of popular Identifiers. There are three major metadresolvers: <ul><li><a href=\"https://faircore4eosc.eu/eosc-core-components/eosc-pid-meta-resolver-pidmr\" target=\"_blank\" style=\"color:#fff\">PIDMR</a> (developed by FAIRCORE4EOSC and operated by GWDG)</li><li><a href=\"http://Identifiers.org\" target=\"_blank\" style=\"color:#fff\">Identifiers.org</a></li><li><a href=\"http://N2T.org\" target=\"_blank\" style=\"color:#fff\">N2T.org</a></li></ul>",
        }}
      />,
      <PieChartFacet
        config={{
          id: "namespaceType",
          field: "namespace_type",
          title: "Namespace Type",
          cols: 4,
          rows: 1,
          tooltip: "The Namespace Type is linked to the uniqueness of an identifier. Several practices are identifiable in the PID landscape:<ul><li>Unique Hash: The identifier will always be globally unique since it is a content-derived hash.</li><li>Static Prefix/Unique Hash: A prefix is used to ensure that all identifiers are recognizable as a specific type, in addition to a unique hash (for example, SWHID).</li><li>Semantic Prefix/Unique Hash: A prefix is used to ensure that all identifiers are recognizable as a specific type, in addition to a unique hash (for example, dPID).</li><li>Semantic Prefix: A prefix (namespace) guarantees uniqueness and identifies, for example, a provider, an identifier type, or a scientific discipline.</li><li>Static Prefix: The prefix guarantees uniqueness but is otherwise meaningless.</li><li>No Prefix: No prefix is present, and identifiers are not necessarily globally unique unless some additional context is known (for example, all local identifiers in a specific database).</li></ul>",
          legend: true,
        }}
      />,
      <PieChartFacet
        config={{
          id: "persistent",
          field: "persistent",
          title: "Persistent",
          cols: 4,
          rows: 1,
          tooltip: "Not all Identifiers are persistent, and if they are, the type of persistence varies:<ul><li>Implicit: The identifier is not designed to be a persistent reference to an object or thing, but it has de facto become one—for example, Wikidata entries or GitHub repo URLs.</li><li>Explicit: The identifier was designed and is asserted to be persistent—for example, an ARK or a Handle.</li></ul>For each of these options, we sometimes add a qualifier:<ul><li>Yes: In practice, this acts as if it is persistent in the long term.</li><li>No: In practice, there is no expectation that the identifier will be persistent.</li></ul>",
          legend: true,
        }}
      />,
      <PieChartFacet
        config={{
          id: "unique",
          field: "unique",
          title: "Uniqueness",
          cols: 4,
          rows: 1,
          tooltip: "Identifiers do not all guarantee uniqueness in the same way, and some are not globally unique as a result.<ul><li>Globally unique: the identifier will never be the same as any other identifier - for example, a unique hash based on content.</li><li>Namespace unique: the identifier string, when combined with a namespace, is globally unique since the namespace administrator manages uniqueness in the collection.</li><li>Locally unique: without some additional context (e.g., which database an identifier is derived from), the identifier is not unique.</li></ul>",
          legend: true,
        }}
      />,
      <PieChartFacet
        config={{
          id: "managers",
          field: "managers",
          title: "Managers",
          groupByLabel: "label",
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
      <ListFacet
        config={{
          id: "authority",
          field: "authority",
          title: "Authority",
          cols: 4,
          rows: 1,
          tooltip: "<p>Authorities ensure that Identifiers are unique, are resolvable, and that Identifiers are issued based on a standardized schema.</p><p>Some Authorities provide these services for more than one Provider, and by extension, for more than one Identifier.</p>",
        }}
      />,
      <ListFacet
        config={{
          id: "scheme",
          field: "scheme",
          title: "Scheme",
          cols: 4,
          rows: 1,
          tooltip: "<p>Many Identifiers are based on a Scheme, and the Scheme is sometimes standardised or based on an existing Standard.</p><p>For example, many Identifiers are based on the Digital Object identifier scheme (DOI), which in turn is a special case of the Handle System scheme. Or, both ORCIDs and URN:ISNI are based on the International Standard Name Identifier scheme.</p>",
        }}
      />,
      <ListFacet
        config={{
          id: "standard",
          field: "standard",
          title: "Standard",
          cols: 4,
          rows: 1,
          tooltip: "The Scheme that an Identifier is based on is sometimes standardised or based on an existing Standard, but many schemes also rely on internal or informally published standards.",
        }}
      />,
      <PieChartFacet
        config={{
          id: "spatialCoverage",
          field: "coverage",
          title: "Country-Specific",
          cols: 6,
          rows: 1,
          tooltip: "Some Identifiers are only used in a specific country or region. As examples - URN:NBN identifiers are all customised for use by a National Library or entity in a specific country, and it several countries have their own identifiers for researchers.",
          legend: true,
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
          tooltip: "Most Identifiers are domain-agnostic, but there are important examples of domain-specific identifiers - especially in the life sciences.",
        }}
      />,
    ],
  },
];
