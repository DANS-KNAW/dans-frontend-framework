import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import languages from '../config/languages';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18n as i18nLayout } from '@dans-framework/layout';
import { i18n as i18nDeposit } from '@dans-framework/deposit';

// this is the main language provider for all subcomponents/libraries
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    supportedLngs: languages,
    detection: {
      order: ['cookie', 'localStorage'],
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

// make sure to import languages for the components that need it
i18n.on('languageChanged', (lng) => {
  i18nLayout.changeLanguage(lng);
  i18nDeposit.changeLanguage(lng);
});

export default i18n;
