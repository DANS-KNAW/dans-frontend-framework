import type { LanguageStrings, Language } from './types';

export const lookupLanguageString = (obj: LanguageStrings | string | undefined, language: string): string | undefined => {
  return (
    obj === undefined ?
    '' :
    typeof obj === 'string' ? 
    obj : 
    obj[language as Language]
  );
}

export type { LanguageStrings, Language };