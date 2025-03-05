import type { LanguageStrings } from "@dans-framework/utils";
import type { Field, BaseField, RepeatableField } from "./MetadataFields";
import type { FormActionType, Target } from "@dans-framework/user-auth";

// Accordion sections
export interface InitialSectionType {
  id: string;
  title: string | LanguageStrings;
  fields: Field[];
  description?: string | LanguageStrings;
}

export type SectionStatus =
  | "error"
  | "warning"
  | "success"
  | "neutral"
  | undefined;

// Initial state of the form's metadata
export interface InitialStateType {
  id: string;
  touched: boolean;
  form: InitialSectionType[];
  sections: DynamicSections;
  fields: MetadataStructure;
  fieldMap: FieldMapStructure;
}

type SectionKey = string; // Variable section keys 

export interface DynamicSection {
  fields: string[]; // List of field names
  status: SectionStatus; // Possible status values
}
export type DynamicSections = Record<SectionKey, DynamicSection>; // Dynamic section keys

export interface MetadataStructure {
  [key: string]: BaseField | RepeatableField;
}

export interface FieldMapStructure {
  [key: string]: Field;
}

// Config for the form, specified by app
export interface FormConfig {
  form?: InitialSectionType[];
  target?: {
    envName?: string;
    configName?: string;
  };
  targetCredentials: Target[];
  submitKey?: string;
  skipValidation?: boolean;
  geonamesApiKey?: string;
  gsheetsApiKey?: string;
  formDisabled?: boolean;
  formTitle?: any;
  filesUpload?: {
    embargoDate?: boolean;
    convertFiles?: boolean;
    displayRoles?: boolean;
    displayProcesses?: boolean;
    displayPrivate?: boolean;
    fileRoles?: {
      label: string | LanguageStrings;
      value: string;
    }[];
    embargoDateMin?: number;
    embargoDateMax?: number;
    maxSize?: number;
    disableFileWarning?: boolean | number;
    customFileWarning?: string | LanguageStrings;
  };
  displayName?: string | LanguageStrings;
  description?: string | LanguageStrings;
  external?: string;
}

// What you get from server API (previously saved/submitted forms)
export interface ExternalMetadata {
  metadata: MetadataStructure;
  action: FormActionType | undefined;
  id: string;
}