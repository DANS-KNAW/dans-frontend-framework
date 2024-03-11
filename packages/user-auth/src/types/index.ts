import type { LanguageStrings } from "@dans-framework/utils";

export interface AuthProviderConfig {
  authority: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  loadUserInfo: boolean;
}

// Define the types of targets here, so we can use this in the key checking API
export type AuthKeys = "dataverse_api_key" | "zenodo_api_key";

export interface Target {
  name: string;
  helpText?: string | LanguageStrings;
  repo: string;
  auth: string;
  authKey: string;
  keyUrl: string;
  keyCheckUrl?: string;
}

export interface ValidateTarget {
  url: string;
  key: string;
  type: AuthKeys;
}

export type ReleaseVersion = "DRAFT" | "PUBLISHED" | "PUBLISH";

type ActiveStatus =
  | "initial"
  | "processing"
  | "submitted"
  | "finalizing"
  | "progress";
type ErrorStatus = "rejected" | "failed" | "error";
type SuccessStatus = "finish" | "accepted" | "success";
export type IngestStatus = ActiveStatus | ErrorStatus | SuccessStatus;
type IngestStatusKeys = "processing" | "error" | "success";
export type DepositStatus = { [key in IngestStatusKeys]: IngestStatus[] };

export interface TargetOutput {
  "deposit-status": IngestStatus;
  "deposit-time": string;
  "display-name": string;
  "output-response": any;
  "repo-name": string;
}

export interface SubmissionResponse {
  "created-date": string;
  "dataset-id": string;
  "release-version": ReleaseVersion;
  "saved-date": string | null;
  "submitted-date": string | null;
  targets: TargetOutput[];
  title: string;
}

// Some values that the system can pull and fill in from the User Auth object
export type AuthProperty =
  | "name"
  | "email"
  | "voperson_external_affiliation"
  | "family_name"
  | "given_name";

export interface FormAction {
  id?: string;
  action?: "load" | "copy" | "resubmit" | "view";
  actionDone?: boolean;
}

export interface UserFormAction {
  formAction: FormAction;
}
