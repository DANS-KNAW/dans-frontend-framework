import type { LanguageStrings } from "@dans-framework/utils";
import type { FunctionComponent } from 'react';

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
  | "rda-annotator"
  | "fair-guidance";

export interface Page {
  id: string;
  name: string | LanguageStrings;
  slug?: string; // slug for in-app links
  template?: Template;
  inMenu: boolean;
  menuTitle?: string | LanguageStrings;
  content?: string | LanguageStrings;
  action?: PageAction;
  logo?: any;
  restricted?: boolean; // display only when logged in
  link?: string; // for external links
  newTab?: boolean; // for external links
  icon?: FunctionComponent;
}
