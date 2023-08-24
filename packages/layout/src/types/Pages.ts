import type { ReactNode, SyntheticEvent } from 'react';
import type { Language, LanguageStrings } from './Language';
import type { InitialFormType } from './Metadata';

interface PageAction {
  link: string;
  text: string | LanguageStrings;
  restricted?: boolean; // display when logged in, otherwise show a login button
}

export type Template = 'deposit' | 'generic';

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

export interface Link {
  name: string | LanguageStrings;
  link: string;
  icon?: string;
}

export interface Footer {
  header?: string | LanguageStrings;
  links?: Link[];
  freetext?: string | LanguageStrings;
}

export interface MenuBarProps {
  pages: Page[];
}

export interface PageProps {
  page: Page;
}

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface TabHeaderProps {
  handleChange: (event: SyntheticEvent, newValue: number) => void;
  value: number;
}

export interface ComponentTypes {
  [key: string]: (values: PageProps) => JSX.Element;
}