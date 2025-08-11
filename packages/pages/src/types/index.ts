import type { LanguageStrings } from "@dans-framework/utils";
import type { FunctionComponent, ReactNode } from "react";

interface PageAction {
  link: string;
  text: string | LanguageStrings;
  restricted?: boolean; // display when logged in, otherwise show a login button
}

export type Template =
  | "generic"
  | "deposit"
  | "search"
  | "record"
  | "dashboard"
  | "advisor"
  | "mapper"
  | "rda-annotator";

/**
 * Type for language-specific content that can be either string or JSX
 */
export type LanguageContent = {
  [key: string]: string | ReactNode;
};

export interface Page {
  id: string;
  name: string | LanguageStrings;
  slug?: string; // slug for in-app links
  template?: Template;
  inMenu: boolean;
  menuTitle?: string | LanguageStrings;
  content?: string | LanguageStrings | ReactNode | LanguageContent;
  action?: PageAction;
  logo?: any;
  restricted?: boolean; // display only when logged in
  link?: string; // for external links
  newTab?: boolean; // for external links
  icon?: FunctionComponent;
}
