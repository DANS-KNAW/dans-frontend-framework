import { i18n as registerLayoutI18n } from "@dans-framework/layout";
import { i18n as registerAuthI18n } from "@dans-framework/user-auth";
import { i18n as registerRDTSearchUiI18n } from "@dans-framework/rdt-search-ui";
import { createI18n } from "@dans-framework/i18n";

const i18n = createI18n(
  [registerLayoutI18n, registerAuthI18n, registerRDTSearchUiI18n],
  ['nl', 'en'],
  {
    debug: import.meta.env.DEV,
    fallbackLng: "en",
  }
);

export default i18n;
