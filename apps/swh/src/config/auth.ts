const authProvider = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY as string,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
  scope: import.meta.env.VITE_OIDC_SCOPE as string,
  redirect_uri: `${window.location.origin}/signin-callback`,
  loadUserInfo: true,
};

export default authProvider;