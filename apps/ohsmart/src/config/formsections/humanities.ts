import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'humanities',
  title: {
    en: 'Humanities',
    nl: 'Geesteswetenschappen',
  },
  fields: [
    {
      type: 'autocomplete',
      label: {
        en: 'Domain-specific keywords',
        nl: 'Domeinspecifieke trefwoorden',
      },
      name: 'domain_specific_keywords',
      required: true,
      multiselect: true,
      description: {
        en: '',
        nl: '',
      },
      options: 'elsst',
    },
  ],
};

export default section;