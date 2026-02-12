import { i18n as registerLayoutI18n } from "@dans-framework/layout";
import { i18n as registerDepositI18n } from "@dans-framework/deposit";
import { i18n as registerAuthI18n } from "@dans-framework/user-auth";
import { i18n as registerRepoI18n } from "@dans-framework/repo-advisor";
import { createI18n } from "@dans-framework/i18n";

const i18n = createI18n(
  [registerLayoutI18n, registerDepositI18n, registerAuthI18n, registerRepoI18n],
  ['nl', 'en'],
  {
    debug: import.meta.env.DEV,
    fallbackLng: "en",
  }
);

export default i18n;
