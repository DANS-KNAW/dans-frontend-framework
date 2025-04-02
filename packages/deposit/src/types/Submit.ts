import type { Target } from "@dans-framework/user-auth";

export interface SubmitError {
  status?: string;
  data?: string;
}

export interface SubmittedFile {
  id: string;
  progress?: number;
  success?: boolean;
  error?: boolean;
}

export type SubmitStatus =
  | ""
  | "queued"
  | "submitting"
  | "submitted"
  | "error"
  | "saved"
  | "finalising"
  | "success";

export interface ReduxFileSubmitActions {
  id: string;
  progress?: number;
  status?: SubmitStatus;
}

export interface InitialStateType {
  metadataStatus: string;
  submittedFiles: ReduxFileSubmitActions[];
}

export interface EndpointTarget {
  envName?: string;
  configName?: string;
}

export interface HeaderData {
  submitKey: string;
  userId: string;
  target: EndpointTarget;
  targetCredentials: Target[];
  targetKeys: {
    [k: string]: string;
  };
  title?: string;
}