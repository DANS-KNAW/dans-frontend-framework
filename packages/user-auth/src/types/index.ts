import type { LanguageStrings } from '@dans-framework/utils';

export interface AuthProviderConfig {
  authority: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  loadUserInfo: boolean;
}

export interface Target {
  name: string;
  helpText?: string | LanguageStrings;
  repo: string;
  auth: string;
  authKey: string;
  keyUrl: string;
}

// Some values that the system can pull and fill in from the User Auth object
export type AuthProperty = 'name' | 'email' | 'voperson_external_affiliation' | 'family_name' | 'given_name'; 