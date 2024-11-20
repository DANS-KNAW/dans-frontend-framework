import type {
  OptionsType,
  TypeaheadAPI,
  ExtendedMapFeature,
  DateTimeFormat,
} from "./MetadataFields";

// Payloads and types for redux slices
interface Payload {
  sectionIndex: number;
  id: string;
}

export interface SetFieldValuePayload extends Payload {
  value:
    | string
    | string[]
    | OptionsType
    | OptionsType[]
    | ExtendedMapFeature[]
    | null;
}

export interface SetFieldMultiApiPayload extends Payload {
  value: TypeaheadAPI;
}

export interface SetFieldFormatPayload extends Payload {
  value: DateTimeFormat;
}

export interface SetFieldValidPayload extends Payload {
  value: boolean;
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
