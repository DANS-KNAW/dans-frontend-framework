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
  DateRangeFieldType,
  DrawMapFieldType,
  FormField
} from "./MetadataFields";
import type { AutocompleteRenderGetTagProps } from "@mui/material";

// Props for components
export interface SingleFieldProps {
  field: Field;
  groupName?: string;
  groupIndex?: number;
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

export interface DateRangeFieldProps extends Omit<DateFieldProps, "field"> {
  field: DateRangeFieldType;
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
  onOpen?: () => void;
  isLoading?: boolean;
  variant?: string;
}

export interface AutocompleteAPIFieldProps extends AutocompleteFieldProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  debouncedInputValue: string;
  data?: AutocompleteAPIFieldData;
  isLoading: boolean;
  isFetching: boolean;
}

export interface DrawMapFieldProps extends Omit<SingleFieldProps, "field"> {
  field: DrawMapFieldType;
}

export interface BaseButtonProps {
  field: Field;
  sx?: any;
  groupName?: string;
  groupIndex?: number;
}

export interface AddButtonProps extends BaseButtonProps {
  disabled?: boolean;
}

export interface DeleteButtonProps extends BaseButtonProps {
  fieldIndex: number;
}

export interface AddDeleteControlsProps extends BaseButtonProps {
  fieldIndex: number;
  fieldValue: FormField[];
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

export interface CommonProps<T extends Field> {
  field: T;
  groupName?: string;
  groupIndex?: number;
}