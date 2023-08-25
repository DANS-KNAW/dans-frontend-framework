import type { LanguageStrings } from '@dans-framework/utils/language';

interface PageAction {
  link: string;
  text: string | LanguageStrings;
  restricted?: boolean; // display when logged in, otherwise show a login button
}

export type Template = 'generic' | 'deposit';

export interface Page {
  id: string;
  name: string | LanguageStrings;
  slug: string;
  template: Template;
  inMenu: boolean;
  menuTitle?: string | LanguageStrings;
  content?: string | LanguageStrings;
  action?: PageAction;
  logo?: any;
  form?: any;
  restricted?: boolean; // display only when logged in
}