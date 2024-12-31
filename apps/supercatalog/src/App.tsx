import { Suspense, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import { SingleRecord } from "./pages/record";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import { elasticConfig } from "./config/elasticSearch";
import {
  FacetedWrapper,
  FacetedSearchProvider,
} from "@dans-framework/rdt-search-ui";
import { AnimatePresence } from "framer-motion";

// Helper to preserve ?embed=true in the url, when present
const useEmbedHandler = () => {
  const location = useLocation();

  // on first render, check if embed=true is present in the url
  const isEmbed = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("embed") === "true";
  }, []);

  // Ensure ?embed=true is always preserved ... not needed, as this should never rerender
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (isEmbed && !location.search.includes("embed=true")) {
  //     const queryParams = new URLSearchParams(location.search);
  //     queryParams.set("embed", "true");
  //     navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
  //   }
  // }, [isEmbed, location.search, location.pathname, navigate]);

  return { isEmbed };
};

const App = () => {
  const { i18n } = useTranslation();
  const { isEmbed } = useEmbedHandler();
  const navigate = useNavigate();

  const [isExiting, setIsExiting] = useState(false); // Track exit state

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      navigate("/search"); // Redirect after animation completes
    }, 300); // Match this duration to your animation's exit duration
  };

  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case "dashboard":
        return <FacetedWrapper dashboard dashRoute="/" resultRoute="/search" />;
      case "search":
        return <FacetedWrapper dashRoute="/" resultRoute="/search" />;
      case "record":
        return (
          <FacetedWrapper dashRoute="/" resultRoute="/search">
            <AnimatePresence>
              {!isExiting && <SingleRecord onClose={handleExit} />}
            </AnimatePresence>
          </FacetedWrapper>
        );
      default:
        return <Generic {...page} />;
    }
  };

  return (
    <ThemeWrapper theme={theme} siteTitle={siteTitle}>
      <FacetedSearchProvider config={elasticConfig}>
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
      </FacetedSearchProvider>
      {!isEmbed && <Footer {...footer} /> }
    </ThemeWrapper>
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
