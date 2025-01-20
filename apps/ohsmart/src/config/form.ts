import type { FormConfig, InitialSectionType } from "@dans-framework/deposit";
import administrative from "./formsections/administrative";
import citation from "./formsections/citation";
import coverage from "./formsections/coverage";
import oralHistorySpecific from "./formsections/oralHistorySpecific";
import relations from "./formsections/relations";
import rights from "./formsections/rights";
import { fileRoleOptions } from "./fileOptions";

// Make sure to import all sections of the form here, and add them to the sections export
// Section data are formatted as js/ts, so we can easily import things like option lists, or set a variable that gets reused
// For now, see types/Metadata.ts to check the types of input fields you can use

const sections = [
  oralHistorySpecific,
  citation,
  coverage,
  relations,
  administrative,
  rights,
];

const form: FormConfig = {
  form: sections as InitialSectionType[],
  formTitle: "title", // must point to a field with a unique name
  target: {
    envName: import.meta.env.VITE_ENV_NAME,
    configName: import.meta.env.VITE_CONFIG_NAME,
  },
  targetCredentials: [
    {
      name: "Dataverse",
      repo: import.meta.env.VITE_TARGET_1_REPO,
      auth: "API_KEY",
      authKey: "dataverse_api_key",
      keyUrl: import.meta.env.VITE_TARGET_1_KEY_URL,
      keyCheckUrl: import.meta.env.VITE_TARGET_1_KEY_CHECK_URL,
      helpText: {
        en: "The OH-SMArt app deposits your data to the DANS Social Sciences and Humanities data station. To be able to do this, you need to have a valid API key in the data station.",
        nl: "De OH-SMArt app slaat je data in het DANS Social Sciences and Humanities datastation. Om dit te kunnen doen, heb je een geldige API sleutel nodig in dit datastation.",
      },
    },
  ],
  submitKey: import.meta.env.VITE_PACKAGING_KEY,
  skipValidation: import.meta.env.DEV,
  filesUpload: {
    fileRoles: fileRoleOptions,
    embargoDate: true,
    embargoDateMin: 2, // days in the future
    embargoDateMax: 18250,
    displayProcesses: false,
    maxSize: 10000000000, // max file size that can be uploaded in bytes
    disableFileWarning: false, // set to true to disable the file warning
    customFileWarning: {
      en: "Have you uploaded your recording, transcript and subtitles?",
      nl: "Heb je je opname, transcript en ondertiteling geüpload?",
    }, // optional custom file warning, will default to a generic warning if not set
  },
};

export default form;
