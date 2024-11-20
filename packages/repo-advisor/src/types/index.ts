import type { LanguageStrings } from "@dans-framework/utils/language";
import type { AutocompleteAPIFieldProps } from "@dans-framework/deposit";
import type { OptionsType, FormConfig } from "@dans-framework/deposit";

export interface RepoResponse {
  advice: {
    displayName: LanguageStrings;
    description: LanguageStrings;
    form?: FormConfig;
    external?: string;
  }[];
}

export interface AutocompleteProps
  extends Omit<AutocompleteAPIFieldProps, "field" | "sectionIndex"> {
  disabled?: boolean;
  label: string;
  setValue: (val: OptionsType | null) => void;
  value: OptionsType | null;
}
