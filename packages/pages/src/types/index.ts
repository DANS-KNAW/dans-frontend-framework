import type { LanguageStrings } from '@dans-framework/utils';

interface PageAction {
  link: string;
  text: string | LanguageStrings;
  restricted?: boolean; // display when logged in, otherwise show a login button
}

export type Template = 'generic' | 'deposit' | 'search' | 'record' | 'dashboard' | 'about' | 'home';

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
  restricted?: boolean; // display only when logged in
}
