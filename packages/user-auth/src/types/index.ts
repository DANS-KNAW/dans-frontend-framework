import type { LanguageStrings } from '@dans-framework/utils';

export interface AuthProviderConfig {
  authority: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  loadUserInfo: boolean;
}

// Define the types of targets here, so we can use this in the key checking API
export type AuthKeys = 'dataverse_api_key' | 'zenodo_api_key';

export interface Target {
  name: string;
  helpText?: string | LanguageStrings;
  repo: string;
  auth: string;
  authKey: string;
  keyUrl: string;
  keyCheckUrl?: string;
}

export type ReleaseVersion = 'DRAFT' | 'PUBLISH';

type IngestStatus = 'initial' | 'processing' | 'finish' | 'error' | 'rejected' | 'failed';

export interface TargetOutput { 
  'ingest-status': IngestStatus;
  'target-output': string;
  'target-repo-name': string;
  'target-repo-display-name': string;
  'target-url': string;
}

export interface SubmissionResponse {
  'created-date': string;
  'metadata-id': string;
  'targets': TargetOutput[];
  'release-version': ReleaseVersion;
  'title': string;
  'submitted-date': string | null;
}

// Some values that the system can pull and fill in from the User Auth object
export type AuthProperty = 'name' | 'email' | 'voperson_external_affiliation' | 'family_name' | 'given_name'; 