import { User } from "oidc-client-ts";

export const getUser = () => {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${
      import.meta.env.VITE_OIDC_CLIENT_ID
    }`,
  );
  if (!oidcStorage) {
    return null;
  }
  return User.fromStorageString(oidcStorage);
};
