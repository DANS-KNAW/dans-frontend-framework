import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "coverage",
  title: {
    en: "Coverage",
    nl: "Dekking",
  },
  fields: [
    {
      type: "autocomplete",
      name: "keywordsWorkingGroups",
      label: {
        en: "Keywords - Working Groups",
        nl: "Trefwoorden - Werkgroepen",
      },
      required: true,
      description: {
        en: "List of working groups",
        nl: "Een lijst van werkgroepen",
      },
      options: "rdaworkinggroups",
      multiselect: true,
      allowFreeText: true,
    },
    {
      type: "autocomplete",
      name: "keywordsDomain",
      label: {
        en: "Keywords - Domain",
        nl: "Trefwoorden - Domein",
      },
      required: true,
      description: {
        en: "List of relevant keywords",
        nl: "Een lijst van relevante trefwoorden",
      },
      options: "domains",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsInterestGroups",
      label: {
        en: "Keywords - Interest Groups",
        nl: "Trefwoorden - Interesse Groepen",
      },
      required: true,
      description: {
        en: "List of Interest Groups",
        nl: "Een lijst van Interesse Groepen",
      },
      options: "interest groups",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsPathways",
      label: {
        en: "Keywords - Pathways",
        nl: "Trefwoorden - Trajecten",
      },
      required: false,
      description: {
        en: "List of relevant keywords",
        nl: "Een lijst van relevante trefwoorden",
      },
      options: "pathways",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsGorc",
      label: {
        en: "Keywords - GORC",
        nl: "Trefwoorden - GORC",
      },
      required: true,
      description: {
        en: "Links to Global Open Research Commons Elements and Features",
        nl: "Links naar Global Open Research Commons Elementen en Features",
      },
      options: "gorc",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: "autocomplete",
      name: "keywordsSdg",
      label: {
        en:"UN Sustainable Development Goals",
        nl: "UN Duurzame Ontwikkelingsdoelen",
      },
      required: true,
      description: {
        en: "Links to UN Sustainable Development Goals",
        nl: "Links naar UN Duurzame Ontwikkelingsdoelen",
      },
      multiselect: true,
      options: "un_sustainable_development_goals",
    }
  ],
};

export default section;
