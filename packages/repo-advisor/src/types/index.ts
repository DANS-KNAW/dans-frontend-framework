import type { LanguageStrings } from "@dans-framework/utils/language";

export interface RepoResponse {
  advice: {
    displayName: LanguageStrings;
    description: LanguageStrings;
    form: any[];
    external?: string;
  }[]
}