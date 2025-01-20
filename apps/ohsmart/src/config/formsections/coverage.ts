import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "coverage",
  title: {
    en: "Subject",
    nl: "Onderwerp",
  },
  fields: [
    {
      type: "autocomplete",
      label: {
        en: "Subject keywords from Getty AAT or free text",
        nl: "Onderwerpstrefwoorden uit Getty AAT of vrije tekst",
      },

      name: "subject_keywords",
      required: true,
      multiselect: true,
      description: {
        en: "<p>Enter keywords that describe the content of your dataset in terms of artistic or architectural subject matter.</p><p>Keywords may either be selected from the Getty Art & Architecture Thesaurus (AAT), or entered as free text.</p>",
        nl: "<p>Voer trefwoorden in die de inhoud van de dataset beschrijven voor wat betreft artistieke of architectonische onderwerpen.</p><p>Trefwoorden kunnen worden geselecteerd uit de Getty Art & Architecture Thesaurus (AAT) of worden ingevoerd als vrije tekst.</p>",
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
        en: "The location(s) that the interview material deals with.",
        nl: "De locatie(s) waar het interview over gaat.",
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
        en: "The dates and times the interview material deals with.",
        nl: "De data en tijdstippen waarover het interview gaat.",
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
          name: "subject_date_time_range",
          description: {
            en: "The start and end date and/or time that the interview material deals with.",
            nl: "Begin en eind van een periode waar het interview over gaat.",
          },
          required: true,
          optionalEndDate: true, // needed if we only require a start date
          fullWidth: true,
        },
      ],
    },
  ],
};

export default section;
