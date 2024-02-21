import type { Dispatch, SetStateAction } from "react";
import type {
  Field,
  GroupedFieldType,
  RepeatGroupedFieldType,
  TextFieldType,
  DateFieldType,
  RadioFieldType,
  CheckFieldType,
  AutocompleteFieldType,
  AutocompleteAPIFieldData,
  TypeaheadAPI,
  OptionsType,
} from "./MetadataFields";
import type { AutocompleteRenderGetTagProps } from "@mui/material";

// Props for components
export interface SingleFieldProps {
  field: Field;
  sectionIndex: number;
}

export interface GroupedFieldProps extends Omit<SingleFieldProps, "field"> {
  field: GroupedFieldType | RepeatGroupedFieldType;
}

export interface TextFieldProps extends Omit<SingleFieldProps, "field"> {
  field: TextFieldType;
  groupedFieldId?: string;
  currentField?: number;
  totalFields?: number;
}

export interface DateFieldProps extends Omit<SingleFieldProps, "field"> {
  field: DateFieldType;
  groupedFieldId?: string;
  currentField?: number;
  totalFields?: number;
}

export interface RadioFieldProps extends Omit<SingleFieldProps, "field"> {
  field: RadioFieldType;
}

export interface CheckFieldProps extends Omit<SingleFieldProps, "field"> {
  field: CheckFieldType;
}

export interface AutocompleteFieldProps
  extends Omit<SingleFieldProps, "field"> {
  field: AutocompleteFieldType;
  isLoading?: boolean;
}

export interface AutocompleteAPIFieldProps extends AutocompleteFieldProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  debouncedInputValue: string;
  data?: AutocompleteAPIFieldData;
  isLoading: boolean;
  isFetching: boolean;
}

interface FieldButtonProps {
  sectionIndex: number;
  groupedFieldId: string;
  size?: "small" | "medium" | "large";
  mt?: number;
  groupedFieldName?: string;
}

export interface DeleteFieldButtonProps extends FieldButtonProps {
  deleteFieldIndex: number;
  deleteGroupId?: string;
}

export interface AddFieldButtonProps extends FieldButtonProps {
  type: "single" | "group";
}

export interface InfoLinkProps {
  link: string;
  apiValue?: TypeaheadAPI;
  chip?: boolean;
  checkValue?: string;
}

export interface InfoChipProps {
  option: OptionsType;
  apiValue?: TypeaheadAPI;
  getTagProps: AutocompleteRenderGetTagProps;
  index: number;
}
