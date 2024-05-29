import type {
  ValidationType,
  OptionsType,
  TypeaheadAPI,
} from "./MetadataFields";

// Payloads and types for redux slices
export type FieldValue = 
    | string
    | string[]
    | OptionsType
    | OptionsType[]
    | null
    | ValidationType;

export interface SetFieldPayload {
  sectionIndex: number;
  id: string;
  value: FieldValue | boolean;
  typeaheadApi?: TypeaheadAPI;
}

export interface AddFieldPayload {
  sectionIndex: number;
  groupedFieldId: string;
  type: "single" | "group";
}

export interface DeleteFieldPayload {
  sectionIndex: number;
  groupedFieldId: string;
  deleteField: number;
}

export interface SectionStatusPayload {
  sectionIndex: number;
}
