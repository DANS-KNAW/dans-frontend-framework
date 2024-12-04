import {
  PieChartFacet,
  ListFacet,
  type EndpointProps,
  type RDTSearchUIProps,
} from "@dans-framework/rdt-search-ui";
import { Cat2Result } from "../pages/search/result";

const fieldConfig: Partial<RDTSearchUIProps> = {
  fullTextFields: ["title^2", "dc_description"],
  fullTextHighlight: {
    fields: {
      title: { number_of_fragments: 0 },
      dc_description: { number_of_fragments: 0 },
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
    url: "https://es.ohsmart.dansdemo.nl/fc4e-cat",
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: Cat2Result,
    onClickResultPath: "record",
    dashboard: [
      <ListFacet
        config={{
          id: "scale",
          field: "scalability.keyword",
          title: {
            en: "Scalability",
            nl: "Schaalbaarheid",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "pids",
          field: "pid_stack.keyword",
          title: {
            en: "PID stack",
            nl: "PID stack",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "ent",
          field: "entity.keyword",
          title: {
            en: "Entity",
            nl: "Entiteit",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "readability",
          field: "readability.keyword",
          title: {
            en: "Readability",
            nl: "Leesbaarheid",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "role",
          field: "role.keyword",
          title: {
            en: "Role",
            nl: "Rol",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "namespace",
          field: "namespace.keyword",
          title: {
            en: "Namespace",
            nl: "Namespace",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "resolutionpoint",
          field: "resolutionpoint.keyword",
          title: {
            en: "Resolution point",
            nl: "Resolutiepunt",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "resolutionchannel",
          field: "resolutionchannel.keyword",
          title: {
            en: "Resolution channel",
            nl: "Resolutiekanaal",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "resolverapi",
          field: "resolverapi.keyword",
          title: {
            en: "Resolver API",
            nl: "Resolver API",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "metaresolveravailable",
          field: "metaresolveravailable.keyword",
          title: {
            en: "Meta resolver available",
            nl: "Meta-resolver beschikbaar",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "negotiationtype",
          field: "negotiationtype.keyword",
          title: {
            en: "Negotiation type",
            nl: "Onderhandelingstype",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "multipleresolution",
          field: "multipleresolution.keyword",
          title: {
            en: "Multiple resolution",
            nl: "Meervoudige resolutie",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "metadataschematype",
          field: "metadataschematype.keyword",
          title: {
            en: "Metadata schema type",
            nl: "Metadataschema type",
          },
          size: 15,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "metadatavariation",
          field: "metadatavariation.keyword",
          title: {
            en: "Metadata variation",
            nl: "Metadatavariatie",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "metadatasupportoptions",
          field: "metadatasupportoptions.keyword",
          title: {
            en: "Metadata support options",
            nl: "Metadatamogelijkheden ondersteunen",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "governanceoptions",
          field: "governanceoptions.keyword",
          title: {
            en: "Governance options",
            nl: "Overheidsmogelijkheden",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "technicalsustainability",
          field: "technicalsustainability.keyword",
          title: {
            en: "Technical sustainability",
            nl: "Technische duurzaamheid",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "posi",
          field: "posi.keyword",
          title: {
            en: "POSI",
            nl: "POSI",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "financialsustainability",
          field: "financialsustainability.keyword",
          title: {
            en: "Financial sustainability",
            nl: "Financiële duurzaamheid",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "servicequality",
          field: "servicequality.keyword",
          title: {
            en: "Service quality",
            nl: "Servicekwaliteit",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "valueaddedservice",
          field: "valueaddedservice.keyword",
          title: {
            en: "Value added service",
            nl: "Toegevoegde waarde service",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "informationintegrity",
          field: "informationintegrity.keyword",
          title: {
            en: "Information integrity",
            nl: "Informatie-integriteit",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "certification",
          field: "certification.keyword",
          title: {
            en: "Certification",
            nl: "Certificering",
          },
          cols: 3,
          rows: 1,
        }}
      />,
    ],
  },
];
