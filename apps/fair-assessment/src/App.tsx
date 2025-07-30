import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Generic, type Page } from "@dans-framework/pages";
import {
  AuthWrapper,
  AuthRoute,
  SignInCallback,
} from "@dans-framework/user-auth";

// Load config variables
import theme from "./config/theme";
import footer from "./config/footer";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import authProvider from "./config/auth";

import Dashboard from "./components/Dashboard";
import UserSettings from "./components/User";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const createElementByTemplate = (page: Page) => {
  switch (page.template) {
    case "dashboard":
      return <Dashboard />;
    default:
      return <Generic {...page} />;
  }
};

const App = () => {
  const { i18n } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper authProvider={authProvider}>
        <ThemeWrapper theme={theme} siteTitle={siteTitle}>
          <BrowserRouter>
            {/* Need to pass along root i18n functions to the language bar */}
            <LanguageBar
              languages={languages}
              changeLanguage={i18n.changeLanguage}
            />
            <MenuBar pages={pages} userSubmissions={false} />
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
                      <UserSettings />
                    </AuthRoute>
                  }
                />
                {(pages as Page[]).map((page) => {
                  return (
                    <Route
                      key={page.id}
                      path={page.slug}
                      element={createElementByTemplate(page)}
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Footer {...footer} />
        </ThemeWrapper>
      </AuthWrapper>
    </QueryClientProvider>
  );
};

export default App;
