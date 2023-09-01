export interface AuthProviderConfig {
  authority: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  loadUserInfo: boolean;
}

export interface Target {
  name: string;
  repo: string;
  auth: string;
  authKey: string;
  keyUrl: string;
}