import type { LanguageStrings, RecursiveOmit } from "@dans-framework/utils";
import type { Field } from "./MetadataFields";
import type { Target, SubmissionResponse } from "@dans-framework/user-auth";
import type { SelectedFile } from "./Files";

// Accordion sections
export interface InitialSectionType {
  id: string;
  title: string | LanguageStrings;
  fields: RecursiveOmit<Field, "id">[];
  description?: string | LanguageStrings;
}

export type SectionStatus =
  | "error"
  | "warning"
  | "success"
  | "neutral"
  | undefined;

export interface SectionType extends Omit<InitialSectionType, "fields"> {
  fields: Field[];
  status: SectionStatus;
}

export interface InitialStateType {
  id: string;
  form: SectionType[];
  panel: string;
  tab: number;
  touched: boolean;
}

export interface InitialFormType {
  metadata: SectionType[];
  id?: string;
  "file-metadata"?: SelectedFile[];
  files?: SelectedFile[];
}

export interface SavedFormResponse extends SubmissionResponse {
  md: InitialFormType;
}

export interface FormConfig {
  form: InitialSectionType[];
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
  };
  displayName?: string | LanguageStrings;
  description?: string | LanguageStrings;
  external?: string;
}
