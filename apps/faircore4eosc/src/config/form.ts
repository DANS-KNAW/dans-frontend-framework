import type { FormConfig, InitialSectionType } from '@dans-framework/deposit';
import administrative from './formsections/citation';
// Make sure to import all sections of the form here, and add them to the sections export
// Section data are formatted as js/ts, so we can easily import things like option lists, or set a variable that gets reused
// For now, see types/Metadata.ts to check the types of input fields you can use

const sections = [
  administrative,
];

const form: FormConfig = {
  form: sections as InitialSectionType[],
  target: [
    // Formatted as array, to support multiple submission targets
    {
      name: 'Zenodo',
      repo: 'demo.ssh.datastations.nl',
      auth: '',
      authKey: '',
      keyUrl: '',
    },
  ],
  submitKey: import.meta.env.VITE_PACKAGING_KEY, // still needed??
  skipValidation: import.meta.env.DEV,
  geonamesApiKey: 'dans_deposit_webapp',
};

export default form;