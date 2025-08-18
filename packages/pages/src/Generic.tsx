import { useEffect, isValidElement } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import type { Page } from "./types";
import { LanguageStrings, lookupLanguageString } from "@dans-framework/utils";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { LoginButton } from "@dans-framework/user-auth";
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils";
import parse from "html-react-parser";

const Generic = ({ logo, name, content, action }: Page) => {
  const auth = useAuth();
  const { i18n } = useTranslation();
  const siteTitle = useSiteTitle();

  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(name, i18n.language));
  }, [siteTitle, name, i18n.language]);

  const renderContent = () => {
    if (!content) return null;

    if (isValidElement(content)) {
      return content;
    }

    if (typeof content === "string") {
      return parse(content);
    }

    // If content is an object, it could be LanguageStrings or LanguageContent
    if (typeof content === "object") {
      const currentLangContent = (content as any)[i18n.language];

      if (currentLangContent !== undefined) {
        if (isValidElement(currentLangContent)) {
          return currentLangContent;
        }

        if (typeof currentLangContent === "string") {
          return parse(currentLangContent);
        }
      }

      // If no language-specific content found, try to use lookupLanguageString
      // This will only work if the content is LanguageStrings (all values are strings)
      if (Object.values(content).every((val) => typeof val === "string")) {
        const stringContent = lookupLanguageString(
          content as LanguageStrings,
          i18n.language
        );
        return stringContent ? parse(stringContent) : null;
      }
    }

    // If content type is not recognized, log a warning and return null
    console.warn(
      "Content type not supported or not recognized. Expected string, JSX, or LanguageStrings."
    );
    return null;
  };

  return (
    <Container>
      <Grid container>
        <Grid
          mdOffset={logo ? 4 : 2.5}
          md={logo ? 4 : 7}
          smOffset={logo ? 3 : 0}
          sm={logo ? 6 : 12}
          xs={logo ? 8 : 12}
          xsOffset={logo ? 2 : 0}
        >
          <Typography variant="h1" sx={{ textAlign: "center" }}>
            {logo ? (
              <img src={logo} alt={siteTitle} title={siteTitle} />
            ) : (
              lookupLanguageString(name, i18n.language)
            )}
          </Typography>
        </Grid>

        <Grid xs={12} mdOffset={2.5} md={7}>
          {content && <Box>{renderContent()}</Box>}
          {action && (
            <Box mt={4} display="flex" justifyContent="center">
              {(action.restricted && auth.isAuthenticated) ||
              !action.restricted ? (
                <Link to={`/${action.link}`}>
                  <Button variant="contained" size="large">
                    {lookupLanguageString(action.text, i18n.language)}
                  </Button>
                </Link>
              ) : (
                <LoginButton variant="contained" />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Generic;
