import type { LanguageStrings } from "@dans-framework/utils";
import type { AuthProperty } from "@dans-framework/user-auth";
import type { Feature, Point, Polygon, LineString, Geometry } from 'geojson';
import type { LngLatBoundsLike } from "react-map-gl";

// All user input field types
export type InputField =
  | TextFieldType
  | DateFieldType
  | DateRangeFieldType
  | AutocompleteFieldType
  | RadioFieldType
  | CheckFieldType
  | RepeatTextFieldType
  | DrawMapFieldType;

// General field, can be input or group
export type Field = InputField | GroupedFieldType | RepeatGroupedFieldType;

// All fields extend the basic field type
interface BasisFieldType {
  id: string; // auto generated uuid
  name: string; // gets mapped by packager
  label: string | LanguageStrings; // appears above field in UI
  touched?: boolean; // checks if user has interacted with field, for validation purposes
  placeholder?: string; // appears if no text has been filled in in UI
  validation?: ValidationType; // optional field validation
  value?: string; // field value, can be pre-filled in config
  repeatable?: boolean; // creates a repeatable single field
  valid?: boolean | ""; // keeps track of field validation state
  disabled?: boolean; // read only field
  description?: string | LanguageStrings; // appears in tooltip in UI
  required?: boolean; // Form won't submit if this field has not been filled in
  private?: boolean; // gets sent to a separate non-public metadata file
  noIndicator?: boolean; // gives a non-required field a neutral status indicator
  toggleRequired?: string[]; // list of field names this field controls required state of conditionally
  toggleRequiredIds?: string[]; // filled programmatically with uuid's
  togglePrivate?: string[]; // list of field names this field controls private state of conditionally
  togglePrivateIds?: string[]; // filled programmatically with uuid's
  toggleTitleGeneration?: boolean; // determines if this field can toggle the forms auto title generation functionality
  fullWidth?: boolean; // set field to be 100% width instead of default 50%
}

export interface TextFieldType extends BasisFieldType {
  type: "text" | "number";
  maxValue?: number; // for numbers only
  minValue?: number; // for numbers only
  multiline?: boolean; // creates a textarea
  autofill?: AuthProperty; // auto fill data from user object
  format?: never;
  fields?: never;
  multiApiValue?: never;
  options?: never;
  minDateField?: never;
  maxDateField?: never;
  autoGenerateValue?: string | LanguageStrings;
}

export interface DateFieldType extends BasisFieldType {
  type: "date";
  format: DateTimeFormat;
  formatOptions?: DateTimeFormat[];
  minDate?: string;
  maxDate?: string;
  validation?: never; // not needed, as a user is forced to enter the date as specified by the format option
  fields?: never;
  multiApiValue?: never;
  options?: never;
  autofill?: never;
  minDateField?: string;
  maxDateField?: string;
}

export interface DateRangeFieldType extends Omit<DateFieldType, "type" | "value"> {
  type: "daterange";
  value?: (string | null)[];
  optionalEndDate?: boolean;
}

export interface AutocompleteFieldType
  extends Omit<BasisFieldType, "value" | "repeatable"> {
  type: "autocomplete";
  multiselect?: boolean; // enables multiple selections in UI
  value?: OptionsType | OptionsType[] | null;
  options: OptionsType[] | TypeaheadAPI[] | TypeaheadAPI; // either a list of (json) options or an API
  allowFreeText?: boolean; // allow the user to enter values not in options
  multiApiValue?: TypeaheadAPI; // allow the user to pick an API from a list
  sheetOptions?: SheetOptions; // only for Google sheets
  repeatable?: never;
  fields?: never;
  format?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

export interface GroupedFieldType
  extends Omit<BasisFieldType, "value" | "touched"> {
  type: "group"; // This type groups multiple single fields
  fields: InputField[];
  value?: never;
  validation?: never;
  valid?: never;
  multiApiValue?: never;
  options?: never;
  format?: never;
  touched?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

export interface RepeatGroupedFieldType
  extends Omit<GroupedFieldType, "fields"> {
  fields: InputField[][]; // only for code, not for config, a group of grouped fields
}

export interface RepeatTextFieldType
  extends Omit<
    BasisFieldType,
    "value" | "validation" | "valid" | "repeatable" | "touched"
  > {
  type: "repeatSingleField"; // group type for repeatable text fields, only used in code, not in config
  fields: TextFieldType[];
  value?: never;
  validation?: never;
  valid?: never;
  repeatable?: never;
  multiApiValue?: never;
  options?: never;
  required?: never;
  format?: never;
  touched?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

export interface RadioFieldType
  extends Omit<BasisFieldType, "validation" | "valid" | "label"> {
  type: "radio";
  layout?: "row"; // if specified, radiobuttons will appear inline
  options: OptionsType[];
  label?: LanguageStrings;
  valid?: never;
  validation?: never;
  multiApiValue?: never;
  fields?: never;
  format?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

export interface CheckFieldType
  extends Omit<BasisFieldType, "value" | "validation" | "valid" | "label"> {
  type: "check";
  value?: string[];
  options: OptionsType[];
  label?: LanguageStrings;
  validation?: never;
  valid?: never;
  multiApiValue?: never;
  fields?: never;
  format?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

export type MapFeatureType = Point | Polygon | LineString;
export interface ExtendedMapFeature<G extends Geometry = Geometry, P = any> extends Feature<G, P> {
  geonames?: OptionsType | undefined;
  originalCoordinates?: number[] | number[][] | number[][][];
  coordinateSystem?: OptionsType;
  label?: never;
  value?: never;
}

export interface CoordinateSystem extends OptionsType {
  bbox?: LngLatBoundsLike;
}

export interface DrawMapFieldType
  extends Omit<BasisFieldType, "value"> {
  type: "drawmap";
  value?: ExtendedMapFeature[];
  wmsLayers?: {
    id: string;
    name: string;
    source: string;
  }[];
  multiApiValue?: never;
  fields?: never;
  format?: never;
  autofill?: never;
  minDateField?: never;
  maxDateField?: never;
}

// Date and time formats to be used in a Date field
export type DateTimeFormat =
  | "DD-MM-YYYY HH:mm"
  | "DD-MM-YYYY"
  | "MM-YYYY"
  | "YYYY";

// API's that can be used by Autocomplete fields
export type Datastations = "elsst" | "narcis" | "dansCollections";
export type TypeaheadAPI =
  | "orcid"
  | "ror"
  | "gorc"
  | "licenses"
  | "geonames"
  | "getty"
  | "sheets"
  | "dansFormats"
  | "rdaworkinggroups"
  | "pathways"
  | "domains"
  | "interest groups"
  | Datastations
  | "sshLicences"
  | "languageList"
  | "biodiversity";

// Options that should be specified if Google Sheet API is used in Autocomplete
interface SheetOptions {
  sheetId: string;
  page: string;
  startAtRow: number;
  labelCol: number;
  valueCol: number;
  headerCol: number;
}

// Option format for values in the autocomplete dropdown
export interface OptionsType {
  label: string | LanguageStrings;
  value: string;
  header?: string | LanguageStrings; // if options need to be grouped, you can specify the header group this option belongs to
  extraLabel?: string; // extra info, used for displaying in dropdown option
  extraContent?: string;
  idLabel?: string; // extra info, used for displaying in dropdown option
  id?: string;
  mandatory?: boolean; // if true, this option will always be pre-selected. Can be set in config.
  freetext?: boolean; // indicates if a value is manually entered by user
  categoryLabel?: string; // used for nested options
  categoryContent?: string; // used for nested options
  url?: string;
  coordinates?: number[];
}

// Validation for text fields
export type ValidationType = "email" | "uri" | "number" | "github-uri";

// Format to return API response in, used by RTK's transformResponse
export interface AutocompleteAPIFieldData<T = OptionsType[]> {
  arg?: string;
  response: T;
}
