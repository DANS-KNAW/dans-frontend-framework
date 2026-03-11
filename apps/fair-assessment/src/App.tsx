import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { ThemeWrapper } from "@dans-framework/theme";
import { MenuBar, Footer } from "@dans-framework/layout";
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
import authProvider from "./config/auth";

import Dashboard from "./components/Dashboard";
import UserSettings from "./components/user/UserSettings";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ElasticWrapper } from "@dans-framework/elastic";
import { SingleRecord } from "@dans-framework/elastic-result";
import { esConfig, esResultConfig } from "./config/elasticConfig";

import Assessment from "./components/assessment/Assessment";
import { AppWrapper } from "@dans-framework/wrapper";

const queryClient = new QueryClient();

const App = () => {
  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case "dashboard":
        return <Dashboard />;
      case "fair-guidance":
        return <ElasticWrapper config={esConfig} resultRoute={page.slug} />
      case "record":
        return <SingleRecord config={esResultConfig} />;
      case "create-assessment":
        return <AuthRoute><Assessment /></AuthRoute>;
      default:
        return <Generic {...page} />;
    }
  };

  return (
    <AppWrapper storeComponents={['user', 'elastic', 'elasticResult']}>
      <QueryClientProvider client={queryClient}>
          <AuthWrapper authProvider={authProvider}>
            <ThemeWrapper theme={theme} siteTitle={siteTitle}>
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
              <Footer {...footer} />
            </ThemeWrapper>
          </AuthWrapper>
      </QueryClientProvider>
    </AppWrapper>
  );
};

const RouterApp = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default RouterApp;