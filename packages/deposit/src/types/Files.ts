import type { LanguageStrings } from "@dans-framework/utils";

export interface FileActions {
  label: string | LanguageStrings;
  value: string;
  for?: string[];
}

export type FileActionType =
  | "process"
  | "role"
  | "private"
  | "valid"
  | "submitProgress"
  | "submitSuccess"
  | "submitError"
  | "submittedFile"
  | "embargo";

export interface ReduxFileActions {
  id: string;
  type: FileActionType;
  value: any;
}

export interface SelectedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  location: FileLocation;
  url: string;
  lastModified: number;
  private?: boolean;
  role?: FileActions;
  process?: FileActions[];
  valid?: boolean;
  embargo?: string;
  submitProgress?: number;
  submitSuccess?: boolean;
  submitError?: boolean;
  submittedFile?: boolean;
  errors?: never;
  file?: never;
  // for translating xls/csv file columns
  mapping?: {
    [key: string]: any;
  };
}

interface FileError {
  code: string;
  message: string;
}

export interface RejectedFiles {
  file: File;
  errors: FileError[];
  name?: never;
}

export type FileLocation = "local" | "online";

export interface DansSimpleList {
  list: string[];
}

export interface GroupedDataObject {
  [key: string]: string[];
}

export interface DansGroupedList {
  type: GroupedDataObject;
}

export interface DansSimpleListQueryResponse {
  data: string[];
  isLoading: boolean;
  isFetching: boolean;
}

interface DansFilesFormat {
  "file-extension": string;
  "mime-type": string[];
  preferred: boolean;
  "required-convert-to": string;
}

interface DansFilesDescription {
  lang: string;
  title: string;
}

export interface DansFilesResponse {
  type: string;
  description: DansFilesDescription[];
  format: DansFilesFormat[];
}

export interface DansFilesQueryResponse {
  data: DansFilesResponse[];
  isLoading: boolean;
  isFetching: boolean;
}

export interface FileItemProps {
  file: SelectedFile;
}

export interface FileActionOptionsProps {
  file: SelectedFile;
  type: "process" | "role";
}
