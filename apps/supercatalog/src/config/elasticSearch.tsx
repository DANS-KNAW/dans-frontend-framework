import {
  DateChartFacet,
  PieChartFacet,
  ListFacet,
  MapFacet,
  type RDTSearchUIProps,
  type EndpointProps,
  type FixedFacetsProps,
} from "@dans-framework/rdt-search-ui";
import { SingleResult } from "../pages/search/result";

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

const fixedFacets: FixedFacetsProps[] = [
  {
    name: "DataverseNL",
    type: "client",
    location: "relationships.client.data.id.keyword",
    value: "dans.dataversenl",
    altValue: "dataverse.nl",
    group: "DANS",
    defaultEnabled: true,
  }, 
  {
    name: "Data Station SSH",
    type: "url",
    location: "attributes.url",
    value: "ssh.datastations.nl",
    group: "DANS",
    defaultEnabled: true,
  }, 
  {
    name: "Data Station Archaeology",
    type: "url",
    location: "attributes.url",
    value: "archaeology.datastations.nl",
    group: "DANS",
    defaultEnabled: true,
  }, 
  {
    name: "Data Station Life Sciences",
    type: "url",
    location: "attributes.url",
    value: "lifesciences.datastations.nl",
    group: "DANS",
    defaultEnabled: true,
  }, 
  {
    name: "Data Station Natural and Engineering Sciences",
    type: "url",
    location: "attributes.url",
    value: "phys-techsciences.datastations.nl",
    group: "DANS",
    defaultEnabled: true,
  }, 
  {
    name: "4TU",
    type: "client",
    location: "relationships.client.data.id.keyword",
    value: "delft.data4tu",
    altValue: "4tu",
    group: "External",
    defaultEnabled: false,
  }, 
  {
    name: "Archaeology",
    type: "keyword",
    location: "attributes.subjects.subject",
    value: "archaeology",
    group: "Subject",
    defaultEnabled: false,
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
    resultBodyComponent: SingleResult,
    onClickResultPath: "record",
    fixedFacets: fixedFacets,
    dashboard: [
      <ListFacet
        config={{
          id: "pw",
          field: "attributes.subjects.subject.keyword",
          title: {
            en: "Subject",
            nl: "Onderwerp",
          },
          cols: 2,
          rows: 1,
        }}
      />,
      <DateChartFacet
        config={{
          id: "date",
          field: "attributes.registered",
          title: {
            en: "Year published",
            nl: "Publicatiejaar",
          },
          interval: "year",
          cols: 6,
          rows: 1,
        }}
      />,
      // To keep it simple(r), we focus on filtering by URL wildcards only in the pie chart
      <PieChartFacet
        config={{
          id: "source",
          field: "attributes.url.keyword",
          groupBy: fixedFacets.filter(f => f.type !== 'keyword').map(f => ({
            name: f.name,
            location: "attributes.url",
            value: f.location === "attributes.url" ? f.value : f.altValue,
          })),
          title: {
            en: "Sources",
            nl: "Sources",
          },
          cols: 4,
          rows: 1,
        }}
      />,
      <MapFacet
        config={{
          id: "map",
          field: "location",
          title: {
            en: "Locations",
            nl: "Locaties",
          },
          cols: 4,
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
      <ListFacet
        config={{
          id: "creators_affiliations",
          field: "attributes.creators.affiliation.keyword",
          title: {
            en: "Creator affiliations",
            nl: "Creator affiliations",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "contributors",
          field: "attributes.contributors.name.keyword",
          title: {
            en: "Contributors",
            nl: "Contributors",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
      <ListFacet
        config={{
          id: "contributors_affiliations",
          field: "attributes.contributors.affiliation.keyword",
          title: {
            en: "Contributor affiliations",
            nl: "Contributor affiliations",
          },
          size: 10,
          cols: 2,
          rows: 1,
        }}
      />,
    ],
  },
];
