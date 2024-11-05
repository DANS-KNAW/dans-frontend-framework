import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "citation",
  title: {
    en: "Citation",
    nl: "Citaten",
  },
  fields: [
    {
      type: "text",
      label: {
        en: "Title",
        nl: "Titel",
      },
      name: "title",
      required: true,
      description: {
        en: "A descriptive title for the work, to be used in citations",
        nl: "Een beschrijvende titel voor deze data, wordt gebruikt in referenties.",
      },
    },
    {
      type: "text",
      label: {
        en: "Subtitle",
        nl: "Ondertitel",
      },
      name: "subtitle",
      noIndicator: true,
      description: {
        en: "You can provide a subtitle if you wish",
        nl: "Je kunt een optionele ondertitel opgeven als je wilt",
      },
    },
    {
      type: "text",
      label: {
        en: "Description",
        nl: "Beschrijving",
      },
      name: "description",
      multiline: true,
      required: true,
      description: {
        en: "Some context. Basic HTML tags are allowed.",
        nl: "Wat context. Simpele HTML tags zijn toegestaan.",
      },
    },
    {
      type: "group",
      label: {
        en: "Author",
        nl: "Auteur",
      },
      name: "author",
      repeatable: true,
      description: {
        en: "Add one or more authors.",
        nl: "Voeg een of meerdere auteurs toe",
      },
      fields: [
        {
          type: "autocomplete",
          label: {
            en: "Name",
            nl: "Naam",
          },
          name: "name",
          required: true,
          description: {
            en: "First and last name",
            nl: "Voor en achternaam",
          },
          options: "orcid",
          allowFreeText: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "affiliation",
          required: true,
          description: {
            en: "",
            nl: "",
          },
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Grant information",
        nl: "Beursinformatie",
      },
      name: "grant",
      repeatable: true,
      description: {
        en: "Optional information if a grant was involved in financing the project",
        nl: "Optionele informatie als het project met behulp van subsidie tot stand is gekomen",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "Grant agency",
            nl: "Subsidieverstrekker",
          },
          name: "grant_agency",
          noIndicator: true,
          description: {
            en: "Information about the agency providing a grant",
            nl: "Informatie over de verstrekker van de beurs of subsidie",
          },
        },
        {
          type: "text",
          label: {
            en: "Grant number/identifier",
            nl: "Dossiernummer van de verstrekte subsidie",
          },
          name: "grant_number",
          noIndicator: true,
          description: {
            en: "Information about the grant number or identifier",
            nl: "Informatie over het dossiernummer van de beurs of subsidie",
          },
        },
      ],
    },
  ],
};

export default section;
