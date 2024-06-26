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
        en: "Language",
        nl: "Taal",
      },
      name: "language",
      required: true,
      description: {
        en: "Language of interview",
        nl: "Taal van het interview",
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
    }
  ],
};

export default section;
