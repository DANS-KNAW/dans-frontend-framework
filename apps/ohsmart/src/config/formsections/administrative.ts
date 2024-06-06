import languageList from "../data/languageList.json";
import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "administrative",
  title: {
    en: "Administrative",
    nl: "Administratief",
  },
  fields: [
    {
      type: "autocomplete",
      label: {
        en: "Language of interview",
        nl: "Taal van interview",
      },
      name: "language_interview",
      required: true,
      description: {
        en: "Provide the language the interview was held in",
        nl: "Geef de taal waarin het interview is gehouden op",
      },
      options: languageList,
    },
    {
      type: "autocomplete",
      label: {
        en: "Language of metadata",
        nl: "Taal van metadata",
      },
      name: "language_metadata",
      required: true,
      multiselect: true,
      description: {
        en: "Provide the language(s) of the metadata you've entered, e.g. the description and title",
        nl: "Geef de taal of talen op van deze metadata, denk bijvoorbeeld aan titel en bescrijving",
      },
      options: languageList,
    },
    {
      type: "date",
      format: "DD-MM-YYYY",
      label: {
        en: "Embargo date",
        nl: "Datum embargo",
      },
      name: "date_available",
      noIndicator: true,
      description: {
        en: "In case of an embargo, you should provide a future date for this field.",
        nl: "In het geval van een embargo kun je hier een toekomstige datum invullen.",
      },
    },
  ],
};

export default section;
