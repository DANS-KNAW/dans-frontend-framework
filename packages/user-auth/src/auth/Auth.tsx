import { useAuth, AuthProvider } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import i18nProvider from "../languages/i18n";
import type { AuthProviderConfig } from "../types";
import { store } from "../redux/store";
import { LoginPage } from "./Login";
import { WebStorageStateStore } from "oidc-client-ts";

export const AuthWrapper = ({
  authProvider,
  children,
}: {
  authProvider: AuthProviderConfig;
  children: ReactNode;
}) => {
  // add some default features to the authprovider
  const authProviderConfig = {
    ...authProvider,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    monitorSession: true, // this allows cross tab login/logout detection
  };
  return (
    <ReduxProvider store={store}>
      <AuthProvider {...authProviderConfig}>
        <I18nextProvider i18n={i18nProvider}>{children}</I18nextProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  return <LoginPage />;
};

export const SignInCallback = () => {
  const auth = useAuth();
  const { t } = useTranslation("auth");

  if (auth.isLoading || auth.activeNavigator) {
    return (
      <Container>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 10,
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            {auth.activeNavigator === "signinSilent" ?
              t("signingIn")
            : auth.activeNavigator === "signoutRedirect" ?
              t("signingOut")
            : t("isLoading")}
          </Typography>
        </Grid>
      </Container>
    );
  }

  if (auth.error) {
    return (
      <Container>
        <Grid container>
          <Grid xs={12} mdOffset={2.5} md={7}>
            <Typography variant="h1">{t("signinError")}</Typography>
            <Typography>{auth.error.message}</Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // When there's a user object, we nagivate back to the 'state' key,
  // aka the previous page that we've set in the Login Button component
  return <Navigate to={auth.user?.state || "/"} />;
};
