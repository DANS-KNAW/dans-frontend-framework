import { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { ThemeWrapper } from "@dans-framework/theme";
import { MenuBar, Footer } from "@dans-framework/layout";
import { Deposit } from "@dans-framework/deposit";
import {
  AuthWrapper,
  AuthRoute,
  UserSettings,
  UserSubmissions,
  SignInCallback,
} from "@dans-framework/user-auth";
import RepoAdvisor from './config/pages/RepoAdvisor';

// Load config variables
import theme from "./config/theme";
import footer from "./config/footer";
import siteTitle from "./config/siteTitle";
import authProvider from "./config/auth";
import form from "./config/form";

const App = () => {
  const [ repoConfig, setRepoConfig ] = useState();
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          <MenuBar pages={[]} />
          {/* Suspense to make sure languages can load first */}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Skeleton height={600} width={900} />
              </Box>
            }
          >
            <Routes>
              <Route path="signin-callback" element={<SignInCallback />} />
              {repoConfig ? [
                <Route
                  path="user-settings"
                  element={
                    <AuthRoute>
                      <UserSettings
                        target={form.targetCredentials}
                        depositSlug=""
                      />
                    </AuthRoute>
                  }
                />,
                <Route
                  path="user-submissions"
                  element={
                    <AuthRoute>
                      <UserSubmissions depositSlug="" />
                    </AuthRoute>
                  }
                />,
                <Route
                  key="deposit"
                  path="deposit"
                  element={
                    <AuthRoute>
                      <Deposit config={form} page={{ 
                        name: "Deposit",
                        id: "deposit",
                        inMenu: false,
                      }} />
                    </AuthRoute>
                  }
                />
              ] :
              <Route
                path=""
                element={
                  <AuthRoute>
                    <RepoAdvisor setRepoConfig={setRepoConfig} />
                  </AuthRoute>
                }
              />
            }
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer {...footer} />
      </ThemeWrapper>
    </AuthWrapper>
  );
};

export default App;
