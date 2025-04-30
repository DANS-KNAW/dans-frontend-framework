import type {
  OptionsType,
  TypeaheadAPI,
  ExtendedMapFeature,
  DateTimeFormat,
  Field,
} from "./MetadataFields";

// Payloads and types for redux slices
interface Payload {
  field: Field;
  fieldIndex?: number;
  groupName?: string;
  groupIndex?: number;
}

export interface AddDeleteFieldPayload extends Payload {
  type?: string;
}

export interface SetFieldValuePayload extends Payload {
  value:
    | string
    | string[]
    | OptionsType
    | OptionsType[]
    | ExtendedMapFeature[]
    | null;
  fields?: string[];
}

export interface SetFieldMultiApiPayload extends Payload {
  value: TypeaheadAPI;
}

export interface SetFieldFormatPayload extends Payload {
  value: DateTimeFormat;
}