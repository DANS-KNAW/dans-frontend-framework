import { Suspense, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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

import { FacetedWrapper, FacetedSearchProvider } from "@dans-framework/rdt-search-ui";
import { elasticConfig } from "./components/elastic/Guidance";
import { DetailedView } from "./components/elastic/Single";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false); // Track exit state

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      navigate("/guidance"); // Redirect after animation completes
    }, 300); 
  };

  const createElementByTemplate = useCallback((page: Page) => {
    switch (page.template) {
      case "dashboard":
        return <Dashboard />;
      case "fair-guidance":
        return <FacetedWrapper resultRoute="/guidance" />;
      case "record":
          return (
            <FacetedWrapper resultRoute="/guidance">
              <AnimatePresence>
                {!isExiting && <DetailedView onClose={handleExit} />}
              </AnimatePresence>
            </FacetedWrapper>
          );
      default:
        return <Generic {...page} />;
    }
  }, [isExiting]);

  return (
    <QueryClientProvider client={queryClient}>
      <FacetedSearchProvider config={elasticConfig}>
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
      </FacetedSearchProvider>
    </QueryClientProvider>
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