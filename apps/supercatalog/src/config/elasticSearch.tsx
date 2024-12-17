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
 * Define a config for 'fixed' facets, that can be changed by the user
 * but do not show up in the 'active' filters
 * For type 'url' we search in the attributes.url value of our ES instance,
 * for 'keyword', we search in attributes.subject.subject value,
 * for 'client', the relationships.client.data.id value.
 */

const fixedFacets = [
  {
    name: "DataverseNL",
    type: "client",
    location: "relationships.client.data.id.keyword",
    value: "dans.dataversenl",
    group: "DANS",
  }, 
  {
    name: "Data Station SSH",
    type: "url",
    location: "attributes.url",
    value: "ssh.datastations.nl",
    group: "DANS",
  }, 
  {
    name: "Data Station Archaeology",
    type: "url",
    location: "attributes.url",
    value: "archaeology.datastations.nl",
    group: "DANS",
  }, 
  {
    name: "Data Station Life Sciences",
    type: "url",
    location: "attributes.url",
    value: "lifesciences.datastations.nl",
    group: "DANS",
  }, 
  {
    name: "Data Station Natural and Engineering Sciences",
    type: "url",
    location: "attributes.url",
    value: "phys-techsciences.datastations.nl",
    group: "DANS",
  }, 
  {
    name: "4TU",
    type: "client",
    location: "relationships.client.data.id.keyword",
    value: "delft.data4tu",
    group: "External",
  }, 
  {
    name: "Archaeology",
    type: "keyword",
    location: "attributes.subjects.subject",
    value: "archaeology",
    group: "Subject",
  }, 
]

/*
 * Note that for the dashboard config, we use cols and rows, based on an 8 col grid.
 * The config is for larger screens. For mobile, we use half width and full width cols.
 */

export const elasticConfig: EndpointProps[] = [
  {
    name: "Super Catalog",
    url: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
    fullTextFields: fieldConfig.fullTextFields,
    fullTextHighlight: fieldConfig.fullTextHighlight,
    resultBodyComponent: Rda2Result,
    onClickResultPath: "record",
    fixedFacets: fixedFacets,
    dashboard: [
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
      <DateChartFacet
        config={{
          id: "date",
          field: "attributes.publicationYear",
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
          id: "creators",
          field: "attributes.creators.name.keyword",
          title: {
            en: "Creators",
            nl: "Creators",
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
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
    ],
  },
];
