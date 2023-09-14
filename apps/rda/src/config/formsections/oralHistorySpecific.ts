import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'ohs',
  title: {
    en: 'Oral-history specific',
    nl: 'Specifiek voor mondelinge geschiedenis',
  },
  fields: [
    {
      type: 'group',
      label: {
        en: 'Interviewee',
        nl: 'Geinterviewde',
      },
      name: 'interviewee',
      description: {
        en: 'Information about the person being interviewed. This data will not be public.',
        nl: 'Informatie over de persoon die wordt geinterviewd. Deze data wordt niet gepubliceerd.',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'interviewee_first_name',
          required: true,
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'interviewee_last_name',
          required: true,
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Preferred name',
            nl: 'Voorkeursnaam',
          },
          name: 'interviewee_preferred_name',
          private: true,
          repeatable: true,
        },
        {
          type: 'date',
          format: 'DD-MM-YYYY',
          label: {
            en: 'Date of birth',
            nl: 'Geboortedatum',
          },
          name: 'interviewee_dob',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Function',
            nl: 'Functie',
          },
          name: 'interviewee_function',          
          private: true,
          repeatable: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'interviewee_affiliation',          
          private: true,
          repeatable: true,
        },
        {
          type: 'check',
          label: {
            en: 'Consent form',
            nl: 'Toestemmingsformulier',
          },
          name: 'interviewee_consent',
          required: true,
          private: true,
          options: [
            {
              value: 'interviewee_consent_signed',
              label: {
                en: 'Signed',
                nl: 'Getekend',
              },
            },
          ],
        },
      ]
    },
    {
      type: 'group',
      label: {
        en: 'Interviewer',
        nl: 'Interviewer',
      },
      name: 'interviewer',
      repeatable: true,
      description: {
        en: 'Information about the person(s) taking the interview. This data will not be public.',
        nl: 'Informatie over de persoon het interview afneemt. Deze data wordt niet gepubliceerd.',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'interviewer_first_name',
          required: true,
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'interviewer_last_name',
          required: true,
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Preferred name',
            nl: 'Voorkeursnaam',
          },
          name: 'interviewer_preferred_name',
          
          private: true,
          repeatable: true,
        },
        {
          type: 'date',
          format: 'DD-MM-YYYY',
          label: {
            en: 'Date of birth',
            nl: 'Geboortedatum',
          },
          name: 'interviewer_dob',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Function',
            nl: 'Functie',
          },
          name: 'interviewer_function',   
          private: true,
          repeatable: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'interviewer_affiliation',
          private: true,
          repeatable: true,
        },
        {
          type: 'check',
          label: {
            en: 'Consent form',
            nl: 'Toestemmingsformulier',
          },
          name: 'interviewer_consent',
          required: true,
          private: true,
          options: [
            {
              value: 'interviewer_consent_signed',
              label: {
                en: 'Signed',
                nl: 'Getekend',
              },
            },
          ],
        },
      ]
    },
    {
      type: 'group',
      label: {
        en: 'Interpreter',
        nl: 'Vertaler',
      },
      name: 'interpreter',
      repeatable: true,
      description: {
        en: 'Information about the person(s) interpreting the interview. This data will not be public.',
        nl: 'Informatie over de persoon het interview heeft vertaald. Deze data wordt niet gepubliceerd.',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'interpreter_first_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'interpreter_last_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Function',
            nl: 'Functie',
          },
          name: 'interpreter_function',
          private: true,
          repeatable: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'interpreter_affiliation',
          private: true,
          repeatable: true,
        },
        {
          type: 'check',
          label: {
            en: 'Consent form',
            nl: 'Toestemmingsformulier',
          },
          name: 'interpreter_consent',
          private: true,
          options: [
            {
              value: 'interpreter_consent_signed',
              label: {
                en: 'Signed',
                nl: 'Getekend',
              },
            },
          ],
        },
      ]
    },
    {
      type: 'group',
      label: {
        en: 'Others preset',
        nl: 'Andere aanwezigen',
      },
      name: 'others',
      repeatable: true,
      description: {
        en: 'Information about other person(s) being present during the interview. This data will not be public.',
        nl: 'Informatie over andere aanwezigen bij het interview. Deze data wordt niet gepubliceerd.',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'others_first_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'others_last_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Function',
            nl: 'Functie',
          },
          name: 'others_function',
          private: true,
          repeatable: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'others_affiliation',
          private: true,
          repeatable: true,
        },
        {
          type: 'check',
          label: {
            en: 'Consent form',
            nl: 'Toestemmingsformulier',
          },
          name: 'others_consent',
          private: true,
          options: [
            {
              value: 'others_consent_signed',
              label: {
                en: 'Signed',
                nl: 'Getekend',
              },
            },
          ],
        },
      ]
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Location of interview',
        nl: 'Locatie van interview',
      },
      name: 'interview_location',
      required: true,
      multiselect: true,
      allowFreeText: true,
      description: {
        en: 'Location where interview was conducted',
        nl: 'Plek waar het interview is afgenomen',
      },
      options: 'geonames',
    },
    {
      type: 'group',
      label: {
        en: 'Date and time',
        nl: 'Datum en tijd',
      },
      name: 'interview_date_time',
      repeatable: true,
      description: {
        en: 'Date and time of interview',
        nl: 'Datum en tijd waarop het interview is afgenomen',
      },
      fields: [
        {
          type: 'date',
          format: 'DD-MM-YYYY',
          formatOptions: ['YYYY', 'MM-YYYY', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm'],
          label: {
            en: 'Start time and date',
            nl: 'Starttijd en -datum',
          },
          name: 'interview_date_time_start',
          required: true,
        },
        {
          type: 'date',
          format: 'DD-MM-YYYY',
          formatOptions: ['YYYY', 'MM-YYYY', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm'],
          label: {
            en: 'End time and date',
            nl: 'Eindtijd en -datum',
          },
          name: 'interview_date_time_end',
        },
      ],
    },
    {
      type: 'group',
      label: {
        en: 'Recorded by',
        nl: 'Opgenomen door',
      },
      name: 'recorded_by',
      repeatable: true,
      description: {
        en: 'Information about the person assisting with recording',
        nl: 'Informatie over de persoon die het interview heeft opgenomen',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'recorded_by_first_name',
          required: false,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'recorded_by_last_name',
          required: false,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'recorded_by_affiliation',
          required: false,
        },
      ],
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Recording format',
        nl: 'Opnameformaat',
      },
      name: 'recording_format', 
      multiselect: true,
      description: {
        en: 'MIME type and other type information',
        nl: 'MIME type en andere type-informatie',
      },
      options: 'dansFormats',
    },
    {
      type: 'text',
      label: {
        en: 'Recording equipment',
        nl: 'Opnameapparatuur',
      },
      name: 'recording_equipment',
      repeatable: true,
    },
    {
      type: 'group',
      label: {
        en: 'Transcriper',
        nl: 'Transcribent',
      },
      name: 'transcript_human',
      repeatable: true,
      description: {
        en: 'In case of transcript by human. This data will not be public.',
        nl: 'Wanneer de transcriptie door een persoon is gedaan. Deze data wordt niet gepubliceerd.',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'First name',
            nl: 'Voornaam',
          },
          name: 'transcript_human_first_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Last name',
            nl: 'Achternaam',
          },
          name: 'transcript_human_last_name',
          private: true,
        },
        {
          type: 'text',
          label: {
            en: 'Function',
            nl: 'Functie',
          },
          name: 'transcript_human_function',       
          private: true,
          repeatable: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'transcript_human_affiliation',
          private: true,
          repeatable: true,
        },
        {
          type: 'check',
          label: {
            en: 'Consent form',
            nl: 'Toestemmingsformulier',
          },
          name: 'transcript_human_consent',
          private: true,
          options: [
            {
              value: 'transcript_human_consent_signed',
              label: {
                en: 'Signed',
                nl: 'Getekend',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'text',
      label: {
        en: 'Transcript by machine',
        nl: 'Machinetranscriptie',
      },
      name: 'transcript_machine',
      repeatable: false,
    },
  ],
};

export default section;