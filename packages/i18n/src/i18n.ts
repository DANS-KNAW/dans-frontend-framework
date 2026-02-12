import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export default function createI18n(
  packageRegistrations: (() => { 
    translations: Record<string, () => Promise<any>>; 
    namespaces: string[] 
  })[],
  languages: string[],
  options?: {
    debug?: boolean;
    fallbackLng?: string;
  }
) {
  const allNamespaces: string[] = [];
  
  // Collect namespaces and set up lazy loading
  packageRegistrations.forEach(register => {
    const { translations, namespaces } = register();
    allNamespaces.push(...namespaces);
    
    // Load translations on-demand when i18next requests them
    Object.entries(translations).forEach(([path, loader]) => {
      const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
      if (match) {
        const [, lng, ns] = match;
        
        // Load immediately in the background
        loader().then((resources) => {
          i18n.addResourceBundle(lng, ns, resources.default || resources, true, true);
        });
      }
    });
  });

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: options?.debug ?? false,
      supportedLngs: languages,
      fallbackLng: options?.fallbackLng ?? "en",
      ns: allNamespaces,
      defaultNS: allNamespaces[0],
      detection: {
        order: ["cookie", "localStorage"],
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18n;
}