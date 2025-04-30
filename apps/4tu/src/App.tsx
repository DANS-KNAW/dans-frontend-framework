import { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Deposit, type FormConfig } from "@dans-framework/deposit";
import {
  AuthWrapper,
  AuthRoute,
  UserSettings,
  UserSubmissions,
  SignInCallback,
} from "@dans-framework/user-auth";
import {
  RepoAdvisor,
  RepoBar,
  NoRepoSelected,
} from "@dans-framework/repo-advisor";
import { Generic, type Page } from "@dans-framework/pages";

// Load config variables
import pages from "./config/pages";
import theme from "./config/theme";
import footer from "./config/footer";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import authProvider from "./config/auth";
import { AnimatePresence, motion } from "framer-motion";

const App = () => {
  const { i18n } = useTranslation();
  const [repoConfig, setRepoConfig] = useState<FormConfig>();
  const configIsSet = repoConfig?.hasOwnProperty("form") || false;
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          {/* Suspense to make sure languages can load first */}
          <Suspense>
            <AnimatePresence>
              {configIsSet && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="repo"
                >
                  <RepoBar repo={repoConfig?.displayName} />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
          <LanguageBar
            languages={languages}
            changeLanguage={i18n.changeLanguage}
          />
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
                path="user-settings"
                element={
                  <AuthRoute>
                    {repoConfig ?
                      <UserSettings
                        target={repoConfig.targetCredentials}
                        depositSlug=""
                      />
                    : <NoRepoSelected advisorLocation="/" />}
                  </AuthRoute>
                }
              />
              <Route
                path="user-submissions"
                element={
                  <AuthRoute>
                    {repoConfig ?
                      <UserSubmissions depositSlug="" targetCredentials={repoConfig.targetCredentials} />
                    : <NoRepoSelected advisorLocation="/" />}
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
                          {repoConfig ?
                            <Deposit config={repoConfig} page={page} />
                          : <NoRepoSelected advisorLocation="/" />}
                        </AuthRoute>
                      : page.template === "advisor" ?
                        <AuthRoute>
                          <RepoAdvisor
                            page={page}
                            setRepoConfig={setRepoConfig}
                            depositLocation="/deposit"
                          />
                        </AuthRoute>
                      : <Generic {...page} />
                    }
                  />
                );
              })}

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
                      />
                    : <NoRepoSelected advisorLocation="/" />}
                  </AuthRoute>
                }
              />
              <Route
                path="*"
                element={
                  <AuthRoute>
                    <NoRepoSelected advisorLocation="/" />
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
