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
      repeatable: true,
    },
    {
      type: "group",
      label: {
        en: "Contact information",
        nl: "Contactinformatie",
      },
      name: "contact",
      description: {
        en: "The person to contact regarding the metadata (curator)",
        nl: "Contactpersoon voor de metadata (curator)",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "Name",
            nl: "Naam",
          },
          name: "contact_name",
          autofill: "name",
          disabled: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "contact_affiliation",
          autofill: "voperson_external_affiliation",
          disabled: true,
        },
        {
          type: "text",
          label: {
            en: "Email",
            nl: "Email",
          },
          name: "contact_email",
          autofill: "email",
          disabled: true,
        },
      ],
    },
  ],
};

export default section;
