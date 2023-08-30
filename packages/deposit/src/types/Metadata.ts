import type { Language, LanguageStrings } from '@dans-framework/utils/language';
import type { Field, TextFieldType, GroupedFieldType, AutocompleteFieldType } from './MetadataFields';

// Accordion sections
export interface InitialSectionType {
  id: string;
  title: string | LanguageStrings;
  fields: Omit<TextFieldType[], 'id'> | Omit<GroupedFieldType[], 'id'> | Omit<AutocompleteFieldType[], 'id'>;
}

export type SectionStatus = 'error' | 'warning' | 'success' | undefined;

export interface SectionType extends Omit<InitialSectionType, 'fields'> {
  fields: Field[];
  status: SectionStatus;
}

export interface InitialStateType {
  id: string;
  form: SectionType[];
  panel: string;
  tab: number;
}

export interface InitialFormType {
  metadata: SectionType[];
  id?: string;
  'file-metadata'?: any;
}

export interface InitialFormProps {
  form: InitialSectionType[];
  targetRepo: string;
  targetKeyIdentifiers: string[];
  submitKey?: string;
  targetAuth?: string;
  skipValidation?: boolean;
  geonamesApiKey?: string;
  gsheetsApiKey?: string;
}