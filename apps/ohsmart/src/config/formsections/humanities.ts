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
        en: 'Enter keywords that describe the content of your dataset in terms of social relations, interactions or phenomena, or ways to study them. Keywords should be selected from the European Languages Social Sciences Thesaurus (ELSST). These keywords have a different scope from the subject keywords under \'Coverage\' (above), which may be selected from the Getty Art & Architecture Thesaurus (AAT), or entered as free text, and which describe the content of your dataset in terms of artistic or architectural subject matter.',
        nl: 'Voer trefwoorden in die de inhoud van de dataset beschrijven in termen van sociale relaties, interacties of verschijnselen, of manieren om ze te bestuderen. Trefwoorden dienen te worden geselecteerd uit de European Languages Social Sciences Thesaurus (ELSST). Deze trefwoorden hebben een andere reikwijdte dan de onderwerptrefwoorden onder \'Dekking\' (hierboven), die kunnen worden geselecteerd uit de Getty Art & Architecture Thesaurus (AAT), of als vrije tekst kunnen worden ingevoerd, en die de inhoud van uw dataset beschrijven in termen van artistieke of architectonische onderwerpen.',
      },
      options: 'elsst',
    },
  ],
};

export default section;