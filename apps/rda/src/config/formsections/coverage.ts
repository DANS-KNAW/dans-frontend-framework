import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "coverage",
  title: {
    en: "Keywords",
    nl: "Trefwoorden",
  },
  fields: [
    // {
    //   type: "autocomplete",
    //   name: "keywordsWorkingGroups",
    //   label: {
    //     en: "Keywords - Working Groups",
    //     nl: "Trefwoorden - Werkgroepen",
    //   },
    //   required: true,
    //   description: {
    //     en: "List of working groups",
    //     nl: "Een lijst van werkgroepen",
    //   },
    //   options: "rdaworkinggroups",
    //   multiselect: true,
    //   allowFreeText: true,
    // },
    {
      type: "autocomplete",
      name: "keywordsDomain",
      label: {
        en: "Primary Domains",
        nl: "Primaire Domeinen",
      },
      required: true,
      description: {
        en: "Select the primary domains relevant to this deposit",
        nl: "Selecteer de primaire domeinen relevant voor dit deposit",
      },
      options: "domains",
      multiselect: true,
      allowFreeText: false,
    },
    // {
    //   type: "autocomplete",
    //   name: "keywordsInterestGroups",
    //   label: {
    //     en: "Keywords - Interest Groups",
    //     nl: "Trefwoorden - Interesse Groepen",
    //   },
    //   required: true,
    //   description: {
    //     en: "List of Interest Groups",
    //     nl: "Een lijst van Interesse Groepen",
    //   },
    //   options: "interest groups",
    //   multiselect: true,
    //   allowFreeText: false,
    // },
    {
      type: "autocomplete",
      name: "keywordsPathways",
      label: {
        en: "Pathways",
        nl: "Trajecten",
      },
      required: true,
      description: {
        en: "Select relevant RDA pathways",
        nl: "Selecteer relevante RDA trajecten",
      },
      options: "pathways",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsGorc",
      label: {
        en: "GORC Elements and Features",
        nl: "GORC Elementen en Features",
      },
      required: false,
      description: {
        en: "GORC International Model v1.1 Elements and Features. See: https://zenodo.org/records/14062994",
        nl: "GORC Internationaal Model v1.1 Elementen en Features. Zie: https://zenodo.org/records/14062994",
      },
      options: "gorc",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsSdg",
      label: {
        en: "UN Sustainable Development Goals",
        nl: "UN Duurzame Ontwikkelingsdoelen",
      },
      required: true,
      description: {
        en: "Links to UN Sustainable Development Goals",
        nl: "Links naar UN Duurzame Ontwikkelingsdoelen",
      },
      multiselect: true,
      options: "un_sustainable_development_goals",
    },
    {
      // TICKET-016: Added free text field for custom keywords
      type: "text",
      name: "otherKeywords",
      label: {
        en: "Additional Keywords",
        nl: "Aanvullende Trefwoorden",
      },
      required: false,
      description: {
        en: "Add any additional keywords not covered by the vocabularies above",
        nl: "Voeg extra trefwoorden toe die niet in de bovenstaande vocabulaires staan",
      },
      repeatable: true,
    },
  ],
};

export default section;
