import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "ohs",
  title: {
    en: "Oral-history specific",
    nl: "Specifiek voor mondelinge geschiedenis",
  },
  fields: [
    {
      type: "group",
      label: {
        en: "Interviewee",
        nl: "Geinterviewde",
      },
      name: "interviewee",
      description: {
        en: "Information about the person being interviewed. This data will not be public.",
        nl: "Informatie over de persoon die wordt geinterviewd. Deze data wordt niet gepubliceerd.",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "interviewee_first_name",
          required: true,
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "interviewee_last_name",
          required: true,
          private: true,
        },
        {
          type: "check",
          name: "interviewee_public",
          description: {
            en: "First and last name of interviewee will be publically viewable if checked",
            nl: "Voor- en achternaam van de geinterviewde zijn publiek als dit is aangevinkt",
          },
          options: [
            {
              value: "interviewee_public_data",
              label: {
                en: "First and last name are public data",
                nl: "Voor- en achternaam zijn publiek",
              },
            },
          ],
          togglePrivate: ["interviewee_first_name", "interviewee_last_name"],
          toggleTitleGeneration: true,
          fullWidth: true,
        },
        {
          type: "text",
          label: {
            en: "Preferred name",
            nl: "Voorkeursnaam",
          },
          name: "interviewee_preferred_name",
          noIndicator: true,
          private: true,
        },
        {
          type: "date",
          format: "DD-MM-YYYY",
          label: {
            en: "Date of birth",
            nl: "Geboortedatum",
          },
          name: "interviewee_dob",
          noIndicator: true,
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Function",
            nl: "Functie",
          },
          name: "interviewee_function",
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "interviewee_affiliation",
          private: true,
        },
        {
          type: "check",
          name: "interviewee_consent",
          description: {
            en: "Consent given for the processing of personal data (including archiving and, if applicable, making accessible for reuse, for instance through an informed consent form)",
            nl: "Toestemming gegeven voor de verwerking van persoonsgegevens (inclusief archivering en, indien van toepassing, toegankelijk maken voor hergebruik, bijvoorbeeld via een toestemmingsformulier)",
          },
          required: true,
          private: true,
          options: [
            {
              value: "interviewee_consent_signed",
              label: {
                en: "Consent given",
                nl: "Toestemming gegeven",
              },
            },
          ],
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Interviewer",
        nl: "Interviewer",
      },
      name: "interviewer",
      repeatable: true,
      description: {
        en: "Information about the person(s) taking the interview. This data will not be public.",
        nl: "Informatie over de persoon het interview afneemt. Deze data wordt niet gepubliceerd.",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "interviewer_first_name",
          required: true,
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "interviewer_last_name",
          required: true,
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Preferred name",
            nl: "Voorkeursnaam",
          },
          name: "interviewer_preferred_name",
          noIndicator: true,
          private: true,
        },
        {
          type: "date",
          format: "DD-MM-YYYY",
          label: {
            en: "Date of birth",
            nl: "Geboortedatum",
          },
          name: "interviewer_dob",
          noIndicator: true,
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Function",
            nl: "Functie",
          },
          name: "interviewer_function",
          private: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "interviewer_affiliation",
          private: true,
        },
        {
          type: "check",
          name: "interviewer_consent",
          description: {
            en: "Consent given for the processing of personal data (including archiving and, if applicable, making accessible for reuse, for instance through an informed consent form)",
            nl: "Toestemming gegeven voor de verwerking van persoonsgegevens (inclusief archivering en, indien van toepassing, toegankelijk maken voor hergebruik, bijvoorbeeld via een toestemmingsformulier)",
          },
          required: true,
          private: true,
          options: [
            {
              value: "interviewer_consent_signed",
              label: {
                en: "Consent given",
                nl: "Toestemming gegeven",
              },
            },
          ],
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Interpreter",
        nl: "Vertaler",
      },
      name: "interpreter",
      repeatable: true,
      description: {
        en: "Information about the person(s) interpreting the interview. This data will not be public.",
        nl: "Informatie over de persoon het interview heeft vertaald. Deze data wordt niet gepubliceerd.",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "interpreter_first_name",
          private: true,
          noIndicator: true,
          toggleRequired: ["interpreter_consent", "interpreter_last_name"],
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "interpreter_last_name",
          private: true,
          noIndicator: true,
          toggleRequired: ["interpreter_consent", "interpreter_first_name"],
        },
        {
          type: "text",
          label: {
            en: "Function",
            nl: "Functie",
          },
          name: "interpreter_function",
          private: true,
          noIndicator: true,
          toggleRequired: [
            "interpreter_consent",
            "interpreter_first_name",
            "interpreter_last_name",
          ],
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "interpreter_affiliation",
          private: true,
          noIndicator: true,
          toggleRequired: [
            "interpreter_consent",
            "interpreter_first_name",
            "interpreter_last_name",
          ],
        },
        {
          type: "check",
          name: "interpreter_consent",
          description: {
            en: "Consent given for the processing of personal data (including archiving and, if applicable, making accessible for reuse, for instance through an informed consent form)",
            nl: "Toestemming gegeven voor de verwerking van persoonsgegevens (inclusief archivering en, indien van toepassing, toegankelijk maken voor hergebruik, bijvoorbeeld via een toestemmingsformulier)",
          },
          private: true,
          noIndicator: true,
          options: [
            {
              value: "interpreter_consent_signed",
              label: {
                en: "Consent given",
                nl: "Toestemming gegeven",
              },
            },
          ],
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Others present",
        nl: "Andere aanwezigen",
      },
      name: "others",
      repeatable: true,
      description: {
        en: "Information about other person(s) being present during the interview. This data will not be public.",
        nl: "Informatie over andere aanwezigen bij het interview. Deze data wordt niet gepubliceerd.",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "others_first_name",
          private: true,
          noIndicator: true,
          toggleRequired: ["others_consent", "others_last_name"],
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "others_last_name",
          private: true,
          noIndicator: true,
          toggleRequired: ["others_consent", "others_first_name"],
        },
        {
          type: "text",
          label: {
            en: "Function",
            nl: "Functie",
          },
          name: "others_function",
          private: true,
          noIndicator: true,
          toggleRequired: [
            "others_consent",
            "others_first_name",
            "others_last_name",
          ],
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "others_affiliation",
          private: true,
          noIndicator: true,
          toggleRequired: [
            "others_consent",
            "others_first_name",
            "others_last_name",
          ],
        },
        {
          type: "check",
          name: "others_consent",
          description: {
            en: "Consent given for the processing of personal data (including archiving and, if applicable, making accessible for reuse, for instance through an informed consent form)",
            nl: "Toestemming gegeven voor de verwerking van persoonsgegevens (inclusief archivering en, indien van toepassing, toegankelijk maken voor hergebruik, bijvoorbeeld via een toestemmingsformulier)",
          },
          private: true,
          noIndicator: true,
          options: [
            {
              value: "others_consent_signed",
              label: {
                en: "Consent given",
                nl: "Toestemming gegeven",
              },
            },
          ],
        },
      ],
    },
    {
      type: "autocomplete",
      label: {
        en: "Location of interview",
        nl: "Locatie van interview",
      },
      name: "interview_location",
      required: true,
      multiselect: true,
      allowFreeText: true,
      description: {
        en: "Location where interview was conducted",
        nl: "Plek waar het interview is afgenomen",
      },
      options: "geonames",
    },
    {
      type: "group",
      label: {
        en: "Date and time",
        nl: "Datum en tijd",
      },
      name: "interview_date_time",
      repeatable: true,
      description: {
        en: "Date and time of interview",
        nl: "Datum en tijd waarop het interview is afgenomen",
      },
      fields: [
        {
          type: "daterange",
          format: "DD-MM-YYYY",
          formatOptions: ["DD-MM-YYYY", "DD-MM-YYYY HH:mm"],
          label: {
            en: "Time and date",
            nl: "Tijd en datum",
          },
          name: "interview_date_time",
          required: true,
          optionalEndDate: true, // if we only require a start date
          fullWidth: true,
        },
      ],
    },
    {
      type: "group",
      label: {
        en: "Recording by",
        nl: "Opgenomen door",
      },
      name: "recorded_by",
      repeatable: true,
      description: {
        en: "Information about the person assisting with recording",
        nl: "Informatie over de persoon die het interview heeft opgenomen",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "recorded_by_first_name",
          noIndicator: true,
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "recorded_by_last_name",
          noIndicator: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "recorded_by_affiliation",
          noIndicator: true,
        },
      ],
    },
    {
      type: "autocomplete",
      label: {
        en: "Recording format",
        nl: "Opnameformaat",
      },
      name: "recording_format",
      multiselect: true,
      description: {
        en: "MIME type and other type information",
        nl: "MIME type en andere type-informatie",
      },
      options: "dansFormats",
      noIndicator: true,
    },
    {
      type: "text",
      label: {
        en: "Recording equipment",
        nl: "Opnameapparatuur",
      },
      name: "recording_equipment",
      noIndicator: true,
      description: {
        en: "Equipment, method, or platform used for recording",
        nl: "Apparatuur/methode gebruikt voor de opname",
      },
    },
    {
      type: "group",
      label: {
        en: "Transcriber",
        nl: "Transcribent",
      },
      name: "transcript_human",
      repeatable: true,
      description: {
        en: "In case of transcript by human. This data will not be public.",
        nl: "Wanneer de transcriptie door een persoon is gedaan. Deze data wordt niet gepubliceerd.",
      },
      fields: [
        {
          type: "text",
          label: {
            en: "First name",
            nl: "Voornaam",
          },
          name: "transcript_human_first_name",
          private: true,
          noIndicator: true,
        },
        {
          type: "text",
          label: {
            en: "Last name",
            nl: "Achternaam",
          },
          name: "transcript_human_last_name",
          private: true,
          noIndicator: true,
        },
        {
          type: "text",
          label: {
            en: "Function",
            nl: "Functie",
          },
          name: "transcript_human_function",
          private: true,
          noIndicator: true,
        },
        {
          type: "text",
          label: {
            en: "Affiliation",
            nl: "Affiliatie",
          },
          name: "transcript_human_affiliation",
          private: true,
          noIndicator: true,
        },
        {
          type: "check",
          name: "transcript_human_consent",
          description: {
            en: "Consent given for the processing of personal data (including archiving and, if applicable, making accessible for reuse, for instance through an informed consent form)",
            nl: "Toestemming gegeven voor de verwerking van persoonsgegevens (inclusief archivering en, indien van toepassing, toegankelijk maken voor hergebruik, bijvoorbeeld via een toestemmingsformulier)",
          },
          private: true,
          noIndicator: true,
          options: [
            {
              value: "transcript_human_consent_signed",
              label: {
                en: "Consent given",
                nl: "Toestemming gegeven",
              },
            },
          ],
        },
      ],
    },
    {
      type: "text",
      label: {
        en: "Transcript by machine",
        nl: "Machinetranscriptie",
      },
      name: "transcript_machine",
      noIndicator: true,
    },
  ],
};

export default section;
