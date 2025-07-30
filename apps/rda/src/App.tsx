import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Deposit } from "@dans-framework/deposit";
import { Generic, Page } from "@dans-framework/pages";
import {
  AuthWrapper,
  AuthRoute,
  UserSettings,
  UserSubmissions,
  SignInCallback,
} from "@dans-framework/user-auth";
import logo from "./config/images/logo.png";
import { RdaRecord } from "./pages/record";

// Load config variables
import theme from "./config/theme";
import footer from "./config/footer";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import authProvider from "./config/auth";
import form from "./config/form";
import { elasticConfig } from "./config/elasticSearch";
import {
  FacetedWrapper,
  FacetedSearchProvider,
} from "@dans-framework/rdt-search-ui";
import { Freshdesk } from "@dans-framework/freshdesk";
import SupportDrawer from "@dans-framework/support-drawer";
import RDAAnnotator from "./pages/rda-annotator";
import { useEmbedHandler } from "@dans-framework/utils";
import { Container, Link, Typography } from "@mui/material";
import SiteTitleWrapper from "./config/sitetitle-wrapper";

const App = () => {
  const { i18n } = useTranslation();
  const { isEmbed } = useEmbedHandler();

  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case "dashboard":
        return (
          <SiteTitleWrapper page={page}>
            {!isEmbed && (
              <Box sx={{ pt: { xs: 4, sm: 8 } }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, lg: 4 } }}>
                  <Box
                    sx={{
                      mx: { xs: "auto", lg: 0 },
                      maxWidth: { xs: "100%", md: "672px" },
                    }}
                  >
                    <Typography
                      component="h1"
                      sx={{
                        fontSize: { xs: "3rem", sm: "4rem" },
                        fontWeight: 600,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.1,
                      }}
                    >
                      RDA Knowledge Base
                    </Typography>
                    <Typography
                      component="p"
                      sx={{
                        mt: 4,
                        fontSize: { xs: "1.125rem", sm: "1.25rem" },
                        fontWeight: 400,
                        lineHeight: 2,
                      }}
                    >
                      The Knowledge Base is a suite of applications that helps
                      users find, annotate, and publish RDA-related materials
                    </Typography>
                  </Box>
                </Container>
              </Box>
            )}
            <FacetedWrapper dashboard dashRoute="/" resultRoute="/search" />
          </SiteTitleWrapper>
        );
      case "search":
        return (
          <SiteTitleWrapper page={page}>
            <FacetedWrapper dashRoute="/" resultRoute="/search" />
          </SiteTitleWrapper>
        );
      case "record":
        return (
          <SiteTitleWrapper page={page}>
            <RdaRecord />
          </SiteTitleWrapper>
        );
      case "deposit":
        return (
          <AuthRoute>
            <Deposit config={form} page={page} />
          </AuthRoute>
        );
      case "rda-annotator":
        return (
          <SiteTitleWrapper page={page}>
            <RDAAnnotator />
          </SiteTitleWrapper>
        );
      default:
        return <Generic {...page} />;
    }
  };

  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <FacetedSearchProvider config={elasticConfig}>
          {/* Need to pass along root i18n functions to the language bar */}
          {!isEmbed && (
            <LanguageBar
              languages={languages}
              changeLanguage={i18n.changeLanguage}
            />
          )}
          <MenuBar pages={pages} logo={logo} embed={isEmbed} />
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
                    <UserSettings target={form.targetCredentials} />
                  </AuthRoute>
                }
              />
              <Route
                path="user-submissions"
                element={
                  <AuthRoute>
                    <UserSubmissions
                      targetCredentials={form.targetCredentials}
                    />
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
        </FacetedSearchProvider>
        {isEmbed && (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "white",
              bottom: 6,
              right: 25,
              borderRadius: 1,
            }}
          >
            <Link
              href={window.location.href
                .replace(/(\?|&)embed=true/, "")
                .replace(/[\?&]$/, "")}
              variant="body2"
              sx={{ padding: 1 }}
            >
              RDA Knowledge Base
            </Link>
          </Box>
        )}
        {!isEmbed && <Footer {...footer} />}
        <Freshdesk widgetId={80000010123} />
        <SupportDrawer
          supportMaterialEndpoint={import.meta.env.VITE_SUPPORT_DRAWER_CONFIG}
        />
      </ThemeWrapper>
    </AuthWrapper>
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
