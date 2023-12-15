import type { Target } from "@dans-framework/user-auth";
import type { AxiosHeaders } from "axios";

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
  | "submitting"
  | "submitted"
  | "error"
  | "saved"
  | "success";

export interface ReduxFileSubmitActions {
  id: string;
  progress?: number;
  status?: SubmitStatus;
}

export interface InitialStateType {
  metadataStatus: string;
  submittedFiles: ReduxFileSubmitActions[];
  latestSave: string;
}

export interface HeaderData {
  submitKey: string;
  userId: string;
  target?: {
    envName: string;
    configName: string;
  };
  targetCredentials?: Target[];
  targetKeys?: {
    [k: string]: string;
  };
  title?: string;
}

export interface SubmitHeaders extends AxiosHeaders {
  Authorization: string;
  "user-id": string;
  "auth-env-name"?: string;
  "assistant-config-name"?: string;
  "targets-credentials"?: string;
  title?: string;
}
