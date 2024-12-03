import resourcesToBackend from "i18next-resources-to-backend";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

const i18n = createInstance({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init();

export default i18n;
