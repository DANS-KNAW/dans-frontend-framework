const translations = import.meta.glob('./locales/**/*.json');

export default function registerI18n() {
  return {
    translations,
    namespaces: ['auth', 'user'],
  };
}