import type { LanguageStrings, Language } from "./types";

export const lookupLanguageString = (
  obj: LanguageStrings | string | undefined,
  language: string,
): string | undefined => {
  return (
    obj === undefined ? ""
    : typeof obj === "string" 
    ? obj
    : language !== undefined 
    ? obj[language as Language]
    : Object.values(obj)[0]
  );
};

export type { LanguageStrings, Language };
