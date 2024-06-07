const authProvider = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY as string,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
  scope: import.meta.env.VITE_OIDC_SCOPE as string,
  redirect_uri: encodeURIComponent(`${window.location.origin}/signin-callback/${window.location.search}`),
  loadUserInfo: true,
};

console.log(authProvider)

export default authProvider;
