import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'citation',
  title: {
    en: 'Citation',
    nl: 'Citaten',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      label: {
        en: 'Title',
        nl: 'Titel',
      },
      required: true,
      description: {
        en: 'Title of the deposit',
        nl: 'Titel van het deposit',
      },
    },
    {
      type: 'text',
      name: 'subtitle',
      label: {
        en: 'Subtitle',
        nl: 'Ondertitel',
      },
      description: {
        en: 'Optional subtitle for the deposit',
        nl: 'Optionele ondertitel bij het deposit',
      },
      repeatable: true,
    },
    {
      type: 'group',
      name: 'contributors',
      label: {
        en: 'Contributors',
        nl: 'Bijdragers',
      },
      description: {
        en: 'Add one or more contributors.',
        nl: 'Voeg een of meerdere bijdragers toe',
      },
      repeatable: true,
      fields: [
        {
          type: 'autocomplete',
          name: 'contributor',
          label: {
            en: 'Contributor',
            nl: 'Bijdrager',
          },
          description: {
            en: 'Orcid of the contributor',
            nl: 'Orcid van de bijdrager',
          },
          options: 'orcid',
          allowFreeText: true,
        },
        {
          type: 'autocomplete',
          name: 'contributorType',
          label: {
            en: 'Contributor type',
            nl: 'Type bijdrager',
          },
          description: {
            en: 'Type of contribution',
            nl: 'Type bijdrage',
          },
          options: [
            {
              label: {
                en: 'Author',
                nl: 'Auteur',
              },
              value: 'Author',
            },
            {
              label: {
                en: 'Contact Person',
                nl: 'Contactpersoon',
              },
              value: 'ContactPerson',
            },
            {
              label: {
                en: 'Data Collector',
                nl: 'Data Verzamelaar',
              },
              value: 'DataCollector',
            },
            {
              label: {
                en: 'Data Curator',
                nl: 'Data Curator',
              },
              value: 'DataCurator',
            },
            {
              label: {
                en: 'Data Manager',
                nl: 'Data Beheerder',
              },
              value: 'DataManager',
            },
            {
              label: {
                en: 'Distributor',
                nl: 'Distributeur',
              },
              value: 'Distributor',
            },
            {
              label: {
                en: 'Editor',
                nl: 'Redacteur',
              },
              value: 'Editor',
            },
            {
              label: {
                en: 'Hosting Institution',
                nl: 'Hostende Instelling',
              },
              value: 'HostingInstitution',
            },
            {
              label: {
                en: 'Other',
                nl: 'Overige',
              },
              value: 'Other',
            },
            {
              label: {
                en: 'Producer',
                nl: 'Producent',
              },
              value: 'Producer',
            },
            {
              label: {
                en: 'Project Leader',
                nl: 'Projectleider',
              },
              value: 'ProjectLeader',
            },
            {
              label: {
                en: 'Project Manager',
                nl: 'Projectmanager',
              },
              value: 'ProjectManager',
            },
            {
              label: {
                en: 'Project Member',
                nl: 'Projectlid',
              },
              value: 'ProjectMember',
            },
            {
              label: {
                en: 'Registration Agency',
                nl: 'Registratieagentschap',
              },
              value: 'RegistrationAgency',
            },
            {
              label: {
                en: 'Registration Authority',
                nl: 'Registratieautoriteit',
              },
              value: 'RegistrationAuthority',
            },
            {
              label: {
                en: 'Related Person',
                nl: 'Gerelateerde Persoon',
              },
              value: 'RelatedPerson',
            },
            {
              label: {
                en: 'Researcher',
                nl: 'Onderzoeker',
              },
              value: 'Researcher',
            },
            {
              label: {
                en: 'Research Group',
                nl: 'Onderzoeksgroep',
              },
              value: 'ResearchGroup',
            },
            { 
              label: {
                en: 'Rights Holder',
                nl: 'Rechthebbende',
              },
              value: 'RightsHolder',
            },
            {
              label: {
                en: 'Sponsor',
                nl: 'Sponsor',
              },
              value: 'Sponsor',
            },
            {
              label: {
                en: 'Supervisor',
                nl: 'Supervisor',
              },
              value: 'Supervisor',
            },
            {
              label: {
                en: 'Work Package Leader',
                nl: 'Werkpakketleider',
              },
              value: 'WorkPackageLeader',
            }
          ]
        }
      ]
    },
    {
      type: 'text',
      name: 'description',
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      multiline: true,
      required: true,
      description: {
        en: 'Some context on the deposit.',
        nl: 'Wat context bij het deposit.',
      },
    },
    {
      type: 'autocomplete',
      name: 'publisher',
      label: {
        en: 'Publisher',
        nl: 'Uitgever',
      },
      required: true,
      description: {
        en: 'Institution - often the rights holder',
        nl: 'Instituut - vaak de rechthebbende',
      },
      options: 'ror',
    },
    {
      type: 'date',
      name: 'publicationDate',
      label: {
        en: 'Publication date',
        nl: 'Publicatiedatum',
      },
      required: true,
      description: {
        en: 'Date of publication',
        nl: 'Datum van publicatie',
      },
      format: 'DD-MM-YYYY HH:mm',
    },
  ],
};

export default section;