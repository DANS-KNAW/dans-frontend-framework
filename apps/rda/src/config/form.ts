import type { FormConfig, InitialSectionType } from '@dans-framework/deposit';
import administrative from './formsections/administrative';
import citation from './formsections/citation';
import coverage from './formsections/coverage';
import oralHistorySpecific from './formsections/oralHistorySpecific';
import relations from './formsections/relations';
import rights from './formsections/rights';
import humanities from './formsections/humanities';

// Make sure to import all sections of the form here, and add them to the sections export
// Section data are formatted as js/ts, so we can easily import things like option lists, or set a variable that gets reused
// For now, see types/Metadata.ts to check the types of input fields you can use

const sections = [
  administrative,
  citation,
  oralHistorySpecific,
  coverage,
  humanities,
  relations,
  rights,
];

const form: FormConfig = {
  form: sections as InitialSectionType[],
  target: [
    // Formatted as array, to support multiple submission targets
    {
      name: 'Dataverse',
      repo: 'demo.ssh.datastations.nl',
      auth: 'API_KEY',
      authKey: 'dataverse_api_key',
      keyUrl: 'https://demo.ssh.datastations.nl/dataverseuser.xhtml?selectTab=apiTokenTab',
    },
  ],
  submitKey: import.meta.env.VITE_PACKAGING_KEY, // still needed??
  skipValidation: import.meta.env.DEV,
  geonamesApiKey: 'dans_deposit_webapp',
};

export default form;