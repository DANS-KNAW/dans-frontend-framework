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
      label: {
        en: "Subject keywords",
        nl: "Trefwoorden bij onderwerp",
      },
      name: "subject_keywords",
      required: true,
      multiselect: true,
      description: {
        en: "Enter keywords that describe the content of your dataset in terms of artistic or architectural subject matter. Keywords may either be selected from the Getty Art & Architecture Thesaurus (AAT), or entered as free text. These keywords have a different scope from the 'Humanities' domain-specific keywords (below), which should be selected from the European Languages Social Sciences Thesaurus (ELSST), and which describe the content of your dataset in terms of social relations, interactions or phenomena, or ways to study them.",
        nl: "Voer trefwoorden in die de inhoud van de dataset beschrijven op het gebied van artistieke of architectonische onderwerpen. Trefwoorden kunnen worden geselecteerd uit de Getty Art & Architecture Thesaurus (AAT) of worden ingevoerd als vrije tekst. Deze trefwoorden hebben een andere reikwijdte dan de 'Geesteswetenschappen' domeinspecifieke trefwoorden (hieronder), die moeten worden geselecteerd uit de European Languages Social Sciences Thesaurus (ELSST) en die de inhoud van uw dataset beschrijven in termen van sociale relaties, interacties of verschijnselen, of manieren om ze te bestuderen.",
      },
      options: "getty",
      allowFreeText: true,
      value: [
        {
          label: "oral history (discipline)",
          value: "http://vocab.getty.edu/page/aat/300054402",
          mandatory: true,
        },
      ],
    },
    {
      type: "autocomplete",
      label: {
        en: "Location(s) covered in the interview",
        nl: "Locatie(s) besproken in het interview",
      },
      name: "subject_location",
      multiselect: true,
      description: {
        en: "The location(s) that the interview material deals with",
        nl: "De locatie(s) waar het interview over gaat",
      },
      options: "geonames",
    },
    {
      type: "group",
      label: {
        en: "Period covered in the interview",
        nl: "Periode besproken in het interview",
      },
      name: "subject_date_time",
      repeatable: true,
      description: {
        en: "The dates and times the interview material deals with",
        nl: "De data en tijden waarover het interview gaat",
      },
      fields: [
        {
          type: "daterange",
          format: "YYYY",
          formatOptions: ["YYYY", "MM-YYYY", "DD-MM-YYYY", "DD-MM-YYYY HH:mm"],
          label: {
            en: "Interview period",
            nl: "Interviewperiode",
          },
          name: "subject_date_time",
          description: {
            en: "Start and end of a period the interview covers",
            nl: "Begin en eind van een periode waar het interview over gaat",
          },
          required: true,
          endDateRequired: false, // needed if we only require a start date
          fullWidth: true,
        },
      ],
    },
  ],
};

export default section;
