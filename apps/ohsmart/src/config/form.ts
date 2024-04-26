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
  formTitle: "[1].fields[0]",
  generatedTitle: {
    en: "Interview with {{interviewee_first_name}} {{interviewee_last_name}} in {{interview_location}} on {{interview_date_time_start}}",
    nl: "Interview met {{interviewee_first_name}} {{interviewee_last_name}} in {{interview_location}} op {{interview_date_time_start}}",
  },
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
  },
};

export default form;
