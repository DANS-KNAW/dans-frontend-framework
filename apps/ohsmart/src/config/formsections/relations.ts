import type { InitialSectionType } from "@dans-framework/deposit";

const relationships = [
  "Conforms to",
  "Has Format",
  "Has part",
  "References",
  "Replaces",
  "Requires",
  "Has version",
  "Is format of",
  "Is part of",
  "Is referenced by",
  "Is replaced by",
  "Is required by",
  "Is version of",
];

const section: InitialSectionType = {
  id: "relations",
  title: {
    en: "Relations",
    nl: "Relaties",
  },
  fields: [
    {
      type: "autocomplete",
      label: {
        en: "Audience",
        nl: "Doelgroep",
      },
      name: "audience",
      multiselect: true,
      required: true,
      description: {
        en: "Specifies the research disciplines which may be interested in this dataset. Examples may be Humanities; Arts and Culture; History of Arts and Architecture. Note: the first discipline entered, will automatically inform the 'Subject'-field in the DANS Data Station Social Sciences and Humanities.",
        nl: "Geeft aan welke onderzoeksdisciplines mogelijk geïnteresseerd zijn in deze dataset. Voorbeelden kunnen zijn: Geesteswetenschappen; Kunst en Cultuur; Geschiedenis van Kunst en Architectuur.",
      },
      options: "narcis",
    },
    {
      type: "autocomplete",
      label: {
        en: "Collections",
        nl: "Collecties",
      },
      name: "collections",
      multiselect: true,
      required: true,
      description: {
        en: "Specify the collection(s) of datasets already present in the DANS Data Station Social Sciences and Humanities, to which this dataset should be added.",
        nl: "Selecteer de collectie(s) van datasets in het DANS Data Station Social Sciences and Humanities, waar deze dataset aan moet worden toegevoegd.",
      },
      options: "dansCollections",
      value: [
        {
          mandatory: true,
          label: "Oral History",
          value:
            "https://vocabularies.dans.knaw.nl/collections/ssh/cfa04ed6-4cd0-4651-80cb-ed4ca8fa14f3",
          id: "ssh/cfa04ed6-4cd0-4651-80cb-ed4ca8fa14f3",
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Related to",
        nl: "Gerelateerd aan",
      },
      name: "relation",
      repeatable: true,
      description: {
        en: "Other interviews, publications, projects.",
        nl: "Andere interviews, publicaties, projecten.",
      },
      fields: [
        {
          type: "autocomplete",
          label: {
            en: "Type of relation",
            nl: "Type relatie",
          },
          name: "relation_type",
          description: {
            en: "The type of relation existing between your dataset and some other item or resource.",
            nl: "Het type relatie tussen dit interview en een ander object (interview, dataset, publicatie, project).",
          },
          noIndicator: true,
          options: relationships.map((r: string) => ({
            label: r,
            value: r.toLowerCase(),
          })),
          toggleRequired: ["relation_item", "relation_reference"],
        },
        {
          type: "text",
          label: {
            en: "Related item",
            nl: "Gerelateerd item",
          },
          name: "relation_item",
          noIndicator: true,
          description: {
            en: "Another interview, dataset, publication or project which has some relation with this interview.",
            nl: "Een ander interview, dataset, publicatie of project die een relatie heeft met dit interview.",
          },
        },
        {
          type: "text",
          label: {
            en: "Item reference",
            nl: "Item referentie",
          },
          name: "relation_reference",
          noIndicator: true,
          placeholder: "https://...",
          validation: "uri",
          description: {
            en: "Enter the URL or resolvable persistent identifier (PID) through which the related item may be found and accessed.",
            nl: "Geef de URL of resolvable persistent identifier (PID) om het gerelateerde item te vinden en er toegang toe te krijgen.",
          },
        },
      ],
    },
  ],
};

export default section;
