import type { FormConfig, InitialSectionType } from '@dans-framework/deposit';
import administrative from './formsections/citation';
// Make sure to import all sections of the form here, and add them to the sections export
// Section data are formatted as js/ts, so we can easily import things like option lists, or set a variable that gets reused
// For now, see types/Metadata.ts to check the types of input fields you can use

const sections: InitialSectionType[] = [
  administrative,
];

const form: FormConfig = {
  form: sections,
  formTitle: '[0].fields[0]', // pointer to the field in the 'sections' array that contains form title, which is used in a users submissions overview
  target: {
    envName: import.meta.env.VITE_ENV_NAME,
    configName: import.meta.env.VITE_CONFIG_NAME,
  },
  targetCredentials: [
    // Formatted as array, to support multiple submission targets
    {
      name: 'Dataverse',
      repo: import.meta.env.VITE_TARGET_1_REPO,
      auth: 'API_KEY',
      authKey: 'dataverse_api_key',
      keyUrl: import.meta.env.VITE_TARGET_1_KEY_URL,
      keyCheckUrl: import.meta.env.VITE_TARGET_1_KEY_CHECK_URL,
    },
  ],
  submitKey: import.meta.env.VITE_PACKAGING_KEY, // still needed??
  skipValidation: import.meta.env.DEV,
  geonamesApiKey: import.meta.env.VITE_GEONAMES_API_KEY,
};

export default form;