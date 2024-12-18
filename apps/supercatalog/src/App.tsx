import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Generic, Page } from "@dans-framework/pages";

// Load config variables
import theme from "./config/theme";
import footer from "./config/footer";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import { elasticConfig } from "./config/elasticSearch";
import {
  FacetedWrapper,
  FacetedSearchProvider,
} from "@dans-framework/rdt-search-ui";

const App = () => {
  const { i18n } = useTranslation();

  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case "dashboard":
        return <FacetedWrapper dashboard dashRoute="/" resultRoute="/search" />;
      case "search":
        return <FacetedWrapper dashRoute="/" resultRoute="/search" />;
      default:
        return <Generic {...page} />;
    }
  };

  return (
    <ThemeWrapper theme={theme} siteTitle={siteTitle}>
      <FacetedSearchProvider config={elasticConfig}>
        <BrowserRouter>
          {/* Need to pass along root i18n functions to the language bar */}
          <LanguageBar
            languages={languages}
            changeLanguage={i18n.changeLanguage}
          />
          <MenuBar pages={pages} userMenu={false} />
          {/* Suspense to make sure languages can load first */}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Skeleton height={600} width={900} />
              </Box>
            }
          >
            <Routes>
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
      </FacetedSearchProvider>
      <Footer {...footer} />
    </ThemeWrapper>
  );
};

export default App;
