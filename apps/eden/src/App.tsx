import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar } from "@dans-framework/layout";
import { Generic, Page } from "@dans-framework/pages";
import theme from "./config/theme";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import { useEmbedHandler } from "@dans-framework/utils";
import { AppWrapper } from "@dans-framework/wrapper";
import { ElasticWrapper } from "@dans-framework/elastic";
import { esConfig, esResultConfig } from "./config/elasticConfig";
import { SingleRecord } from "@dans-framework/elastic-result";

const App = () => {
  const { i18n } = useTranslation();
  const { isEmbed } = useEmbedHandler();

  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case "dashboard":
      case "search":
        return <ElasticWrapper config={esConfig} dashRoute="/" resultRoute="/search" />
      case "record":
        return <SingleRecord config={esResultConfig} />;
      default:
        return <Generic {...page} />;
    }
  };

  return (
    <AppWrapper storeComponents={['elastic', 'elasticResult']}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        {/* Need to pass along root i18n functions to the language bar */}
        {!isEmbed && <LanguageBar
          languages={languages}
          changeLanguage={i18n.changeLanguage}
        />}
        <MenuBar pages={pages} userMenu={false} embed={isEmbed} />
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
      </ThemeWrapper>
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
