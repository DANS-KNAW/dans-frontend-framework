import { i18n as registerLayoutI18n } from "@dans-framework/layout";
import { i18n as registerElasticI18n } from "@dans-framework/elastic";
import { i18n as registerElasticResultI18n } from "@dans-framework/elastic-result";
import { createI18n } from "@dans-framework/i18n";

const i18n = createI18n(
  [registerLayoutI18n, registerElasticI18n, registerElasticResultI18n],
  ['nl', 'en'],
  {
    debug: import.meta.env.DEV,
    fallbackLng: "en",
  }
);

export default i18n;
