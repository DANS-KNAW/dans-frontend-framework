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
        en: "Language(s) of interview",
        nl: "Taal of talen van interview",
      },
      name: "language_interview",
      required: true,
      multiselect: true,
      description: {
        en: "Specify the language(s) spoken in the interview.",
        nl: "Geef aan welke talen worden gesproken in het interview.",
      },
      options: "languageList",
    },
    {
      type: "autocomplete",
      label: {
        en: "Language of metadata",
        nl: "Taal van metadata",
      },
      name: "language_metadata",
      required: true,
      description: {
        en: "Specify the language used for entering the metadata, e.g. the description and title (this may be different from the language spoken in the interview).",
        nl: "Geef aan welke taal is gebruikt voor het invoeren van de metadata, zoals de titel en de samenvatting (dit kan een andere taal zijn dan die in het interview wordt gesproken).",
      },
      options: "languageList",
    },
  ],
};

export default section;
