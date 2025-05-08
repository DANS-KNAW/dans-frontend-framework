import {
  DateChartFacet,
  PieChartFacet,
  ListFacet,
  type RDTSearchUIProps,
  type EndpointProps,
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

export const elasticConfig: EndpointProps[] = [
  {
    name: "RDA Catalogue",
    url: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT + "/rda",
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: Rda2Result,
    onClickResultPath: "record",
    dashboard: [
      <ListFacet
        config={{
          id: "pw",
          field: "pathways.pathway.keyword",
          title: {
            en: "Pathways",
            nl: "Paden",
          },
          cutoff: 10,
          size: 8,
          cols: 2,
          rows: 1,
        }}
      />,
      <DateChartFacet
        config={{
          id: "date",
          field: "dc_date",
          title: {
            en: "Timeline",
            nl: "Tijdlijn",
          },
          interval: "year",
          cols: 6,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "indi",
          field: "individuals.fullName.keyword",
          title: {
            en: "Individuals",
            nl: "Individuen",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "wf",
          field: "workflows.WorkflowState.keyword",
          title: {
            en: "Workflows",
            nl: "Workflows",
          },
          cols: 3,
          rows: 1,
        }}
      />,
      <PieChartFacet
        config={{
          id: "subjects",
          field: "subjects.keyword.keyword",
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
          id: "insttype",
          field: "related_institutions.english_name.keyword",
          title: {
            en: "Related institutions",
            nl: "Gerelateerde instellingen",
          },
          cutoff: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "wgs",
          field: "working_groups.title.keyword",
          title: {
            en: "Working groups",
            nl: "Werkgroepen",
          },
          cutoff: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "igs",
          field: "interest_groups.title.keyword",
          title: {
            en: "Interest groups",
            nl: "Interesse groepen",
          },
          cutoff: 10,
          cols: 2,
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
          cutoff: 10,
          cols: 2,
          rows: 1,
        }}
      />,
    ],
  },
];
