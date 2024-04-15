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
        nl: "Publiek",
      },
      name: "audience",
      multiselect: true,
      required: true,
      description: {
        en: "Specifies which research disciplines which may be interested in this dataset. Examples may be Humanities; Arts and Culture; History of Arts and Architecture",
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
        en: "Something here",
        nl: "Iets hier",
      },
      options: "dansCollections",
      value: [{
        mandatory: true,
        "label": "Oral History",
        "value": "https://vocabularies.dans.knaw.nl/collections/ssh/cfa04ed6-4cd0-4651-80cb-ed4ca8fa14f3",
        "id": "ssh/cfa04ed6-4cd0-4651-80cb-ed4ca8fa14f3"
      }],
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
        en: "Other interviews, publications, projects",
        nl: "Andere interviews, publicaties, projecten",
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
            en: "The type of relation to this external item",
            nl: "Type relatie met dit externe item",
          },
          noIndicator: true,
          options: relationships.map((r: string) => ({ label: r, value: r })),
          makesRequired: ["relation_item", "relation_reference"],
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
            en: "Other interviews, publications, projects, or initiatives can be linked here by providing a description, a URL, and selecting a relation type.",
            nl: "Andere interviews, publicaties, projecten of initiatieven kunnen hier worden gelinkt door een beschrijving, een URL en een relatietype te verstrekken.",
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
            en: "A web link or PID reference for this external item",
            nl: "Een weblink of PID referentie naar dit externe item",
          },
        },
      ],
    },
  ],
};

export default section;
