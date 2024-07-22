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
import RepoAdvisor, { NoRepoSelected, CurrentlySelected } from './config/pages/RepoAdvisor';
import type { ExtendedFormConfig } from "./config/pages/apiHelpers";

// Load config variables
import pages from "./config/pages";
import theme from "./config/theme";
import footer from "./config/footer";
import siteTitle from "./config/siteTitle";
import authProvider from "./config/auth";
import { AnimatePresence, motion } from "framer-motion";

const App = () => {
  const [ repoConfig, setRepoConfig ] = useState<ExtendedFormConfig>();
  const configIsSet = repoConfig?.hasOwnProperty('form') || false;
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          <AnimatePresence>
            { configIsSet && 
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key={repoConfig?.displayName.en}
              >
                <CurrentlySelected repo={repoConfig?.displayName.en as string} />
              </motion.div>
            }
          </AnimatePresence>
          <MenuBar 
            pages={pages}
            userSettings={configIsSet}
            userSubmissions={configIsSet}
          />
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
                path=""
                element={
                  <AuthRoute>
                    <RepoAdvisor setRepoConfig={setRepoConfig} />
                  </AuthRoute>
                }
              />
              <Route
                path="user-settings"
                element={
                  <AuthRoute>
                    {repoConfig ?
                      <UserSettings
                        target={repoConfig.targetCredentials}
                        depositSlug=""
                      /> :
                      <NoRepoSelected />
                    }
                  </AuthRoute>
                }
              />
              <Route
                path="user-submissions"
                element={
                  <AuthRoute>
                    {repoConfig ?
                      <UserSubmissions depositSlug="" /> :
                      <NoRepoSelected />
                    }
                  </AuthRoute>
                }
              />
              <Route
                key="deposit"
                path="deposit"
                element={
                  <AuthRoute>
                    {repoConfig ?
                      <Deposit 
                        config={repoConfig} 
                        page={{ 
                          name: "Deposit",
                          id: "deposit",
                          inMenu: true,
                        }} 
                      /> :
                      <NoRepoSelected />
                    }
                  </AuthRoute>
                }
              />
              <Route
                path="*"
                element={
                  <AuthRoute>
                    <NoRepoSelected />
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
