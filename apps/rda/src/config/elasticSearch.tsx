import {
  DateChartFacet,
  PieChartFacet,
  ListFacet,
  type RDTSearchUIProps,
} from "@dans-framework/rdt-search-ui";
import { Rda2Result } from "../pages/search/result";

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

export const elasticConfig = [
  {
    name: "RDA Catalogue",
    url: "https://es.ohsmart.dansdemo.nl/dans-rda2",
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: Rda2Result,
    onClickResultPath: "record",
    dashboard: [
      <ListFacet
        config={{
          id: "indi",
          field: "individuals.fullname.keyword",
          title: {
            en: "Individuals",
            nl: "Individuen",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <DateChartFacet
        config={{
          id: "date",
          field: "dc_date",
          title: {
            en: "Year",
            nl: "Jaar",
          },
          interval: "year",
          cols: 6,
          rows: 1,
        }}
      />,
      <ListFacet
      config={{
        id: "so",
        field: "source.keyword",
        title: {
          en: "Source",
          nl: "Bron",
        },
        size: 10,
        cols: 2,
        rows: 1,
      }}
    />,
      <PieChartFacet
        config={{
          id: "rights",
          field: "rights.description.keyword",
          title: {
            en: "Rights",
            nl: "Rechten",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "lang",
          field: "dc_language.keyword",
          title: {
            en: "Language",
            nl: "Taal",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "wf",
          field: "workflows.workflowstate.keyword",
          title: {
            en: "Workflows",
            nl: "Workflows",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "uritype",
          field: "uritype.uritype.keyword",
          title: {
            en: "URI types",
            nl: "URI types",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "subjects",
          field: "subjects.keyword",
          title: {
            en: "Subjects",
            nl: "Onderwerp",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "reltype",
          field: "relations.relation_type.keyword",
          title: {
            en: "Relation types",
            nl: "Relatietype",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "wgs",
          field: "working_groups.title.keyword",
          title: {
            en: "Working groups",
            nl: "Werkgroepen",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "igs",
          field: "interest_groups.title.keyword",
          title: {
            en: "Interest groups",
            nl: "Interesse groepen",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "pw",
          field: "pathways.pathway.keyword",
          title: {
            en: "Pathways",
            nl: "Paden",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "restype",
          field: "dc_type.keyword",
          title: {
            en: "Resource type",
            nl: "Brontype",
          },
          size: 15,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "disciplines",
          field: "disciplines.list_item.keyword",
          title: {
            en: "Domains",
            nl: "Domeinen",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "insttype",
          field: "institutions.english_name.keyword",
          title: {
            en: "Related institutions",
            nl: "Gerelateerde instellingen",
          },
          cols: 2,
          rows: 1,
        }}
      />,
    ],
  },
];
