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
      multiselect: true,
      description: {
        en: "Provide the language(s) of the metadata you've entered, e.g. the description and title",
        nl: "Geef de taal of talen op van deze metadata, denk bijvoorbeeld aan titel en bescrijving",
      },
      options: "languageList",
    },
    {
      type: "text",
      label: {
        en: "Email address of dataset contact person",
        nl: "Emailadres contacpersoon dataset",
      },
      name: "contact_email",
      required: true,
      validation: "email",
      autofill: "email",
      description: {
        en: "This is the e-mail address of the person who receives questions about this dataset, once it has been published.",
        nl: "Dit is het e-mailadres van de persoon die vragen ontvangt over deze dataset, wanneer deze is gepubliceerd.",
      },
    },
  ],
};

export default section;
