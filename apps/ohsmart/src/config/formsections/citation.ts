import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "citation",
  title: {
    en: "Citation",
    nl: "Bibliografisch",
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
        en: "<p>A descriptive title for the interview dataset, to be used in citations.</p><p>A title will be automatically generated if the following conditions apply:</p><ul><li>Under Interviewee the checkbox for 'First and last name are public data' has been checked</li><li>Location of the interview has been provided</li><li>Date of the interview has been provided</li></ul><p>The automatically generated title can always been adapted manually.</p>",
        nl: "<p>Een beschrijvende titel voor de interview dataset, voor gebruik in citaties.</p><p>Er wordt automatisch een titel gegenereerd, als de aan volgende voorwaarden wordt voldaan:</p><ul><li>Onder de geïnterviewde is 'Voor- en achternaam zijn openbaar' aangevinkt</li><li>Locatie van het interview is ingevoerd</li><li>Datum van het interview is ingevoerd</li></ul><p>De automatisch gegenereerde titel kan altijd worden aangepast.</p>",
      },
      autoGenerateValue: {
        en: "Interview with {{interviewee.interviewee_first_name}} {{interviewee.interviewee_last_name}}, {{interview_location}}, {{interview_date_time.interview_date_time_range}}",
        nl: "Interview met {{interviewee.interviewee_first_name}} {{interviewee.interviewee_last_name}}, {{interview_location}}, {{interview_date_time.interview_date_time_range}}",
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
        en: "<p>You can provide a subtitle if you wish.</p><p>The subtitle you provide here will <b>not</b> be added to the citation line in Dataverse.</p>",
        nl: "<p>Je kunt een optionele ondertitel opgeven als je wilt.</p><p>De ondertitel die je hier opgeeft wordt <b>niet</b> aan de citation in Dataverse toegevoegd.</p>",
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
        en: "Some context on the interview. What is the role and relevance of the interviewee in the project? What led to the interview being conducted? Summary of what was discussed in the interview, with time breakdown, and describe important events in the interview. Briefly describe the setting and atmosphere of the interview to indicate what does not emerge when only the text is read.",
        nl: "Wat context bij het interview. Wat is de rol en relevantie van de geïnterviewde in dit project? Waarom is dit interview afgenomen? Samenvatting van wat er besproken is in het interview, met een tijdsindicatie. Beschrijf belangrijke gebeurtenissen in het interview. Beschrijf kort de setting en sfeer van het interview om duidelijk te maken wat niet naar voren komt wanneer alleen de tekst wordt gelezen.",
      },
    },
    {
      type: "autocomplete",
      label: {
        en: "Publisher",
        nl: "Uitgever",
      },
      name: "publisher",
      required: true,
      description: {
        en: "Institution - often the rights holder.",
        nl: "Instituut - vaak de rechthebbende.",
      },
      options: "ror",
      allowFreeText: true,
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
            en: "First and last name.",
            nl: "Voor en achternaam.",
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
            en: "State the organisation with which the author is affiliated.",
            nl: "Geef de organisatie waar de auteur aan is verbonden.",
          },
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Grant information",
        nl: "Financier",
      },
      name: "grant",
      repeatable: true,
      description: {
        en: "Optional information if a grant was involved in financing the project.",
        nl: "Optionele informatie als het project met behulp van subsidie tot stand is gekomen.",
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
            en: "Information about the agency providing a grant.",
            nl: "Informatie over de verstrekker van de beurs of subsidie.",
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
            en: "Information about the grant number or identifier.",
            nl: "Het dossiernummer van de verstrekte beurs of subsidie.",
          },
        },
      ],
    },
  ],
};

export default section;
