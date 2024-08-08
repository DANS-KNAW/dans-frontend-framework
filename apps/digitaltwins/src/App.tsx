import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Deposit } from "@dans-framework/deposit";
import { Generic, type Page } from "@dans-framework/pages";
import {
  AuthWrapper,
  AuthRoute,
  UserSettings,
  UserSubmissions,
  SignInCallback,
} from "@dans-framework/user-auth";

// Load config variables
import theme from "./config/theme";
import footer from "./config/footer";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import authProvider from "./config/auth";
import form from "./config/form";

import { FileMapper } from "@dans-framework/file-mapper";

const App = () => {
  const { i18n } = useTranslation();
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          {/* Need to pass along root i18n functions to the language bar */}
          <LanguageBar
            languages={languages}
            changeLanguage={i18n.changeLanguage}
          />
          <MenuBar pages={pages} />
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
              <Route
                path="user-settings"
                element={
                  <AuthRoute>
                    <UserSettings
                      target={form.targetCredentials}
                      depositSlug="deposit"
                    />
                  </AuthRoute>
                }
              />
              <Route
                path="user-submissions"
                element={
                  <AuthRoute>
                    <UserSubmissions />
                  </AuthRoute>
                }
              />
              {(pages as Page[]).map((page) => {
                return (
                  <Route
                    key={page.id}
                    path={page.slug}
                    element={
                      page.template === "deposit" ?
                        <AuthRoute>
                          <Deposit config={form} page={page} />
                        </AuthRoute>
                      : <Generic {...page} />
                    }
                  />
                );
              })}
              <Route
                path="map-dataset"
                element={
                  <AuthRoute>
                    <FileMapper />
                  </AuthRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer {...footer} />
      </ThemeWrapper>
    </AuthWrapper>
  );
};

export default App;
