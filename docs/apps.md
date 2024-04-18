# Metadata form application

How to set up a wrapper application for the components of the DANS framework. Import and configure the components you need.

## Dependencies and env files

Make sure required dependencies are installed in your **package.json**.

Create the appropriate **.env** files. Use the **.env** template below for your **.env.development** and **.env.production** files.
```
## DANS packaging key. Only when Keycloak is not used. Deprecated.
VITE_PACKAGING_KEY = ''

## Packaging target, used by @dans-framework/deposit.
VITE_PACKAGING_TARGET = ''
VITE_ENV_NAME = ''
VITE_CONFIG_NAME = ''

## Target configs. Add more where necessary. Used by @dans-framework/deposit.
VITE_TARGET_1_REPO = ''
VITE_TARGET_1_KEY_URL = ''
VITE_TARGET_1_KEY_CHECK_URL = ''

## OIDC config, used by @dans-framework/user-auth.
VITE_OIDC_AUTHORITY = ''
VITE_OIDC_CLIENT_ID = ''
VITE_OIDC_SCOPE = 'openid profile'

## API keys for getting data from external services, used by @dans-framework/deposit.
VITE_GEONAMES_API_KEY = ''
VITE_GSHEETS_API_KEY = ''

## Freshdesk ticketing, used by @dans-framework/utils/error
VITE_FRESHDESK_API_KEY = ''
VITE_FRESHDESK_URL = ''
VITE_FRESHDESK_AGENT = ''
VITE_FRESHDESK_GROUP = ''
VITE_FRESHDESK_ASSIGNED_TO = ''

## For dev purposes only, used by @dans-framework/deposit
VITE_DISABLE_AUTOSAVE = ''
VITE_DISABLE_API_KEY_MESSAGE = ''

## For Elastic Search projects, used by @dans-framework/rdt-search-ui
VITE_ELASTICSEARCH_API_ENDPOINTS = '[
    {
        "name": "",
        "url": "",
        "user": "",
        "pass": ""
    },
    {
        "name": "",
        "url": ""
    }
]'
```

## Form configuration

The form should be an array of section objects. A section can be configured as indicated in the [@dans-framework/deposit](deposit.md) package. 

## Pages

The pages should be an array of page objects. A page can be configured as indicated in the [@dans-framework/pages](pages.md) package. 

## Footer

The footer consists of a top and bottom section. See the [@dans-framework/layout](layout.md) package. 

## Authentication with Keycloak

For user authentication, you need to supply the proper OIDC configuration. See the [@dans-framework/user-auth](user-auth.md) package.

## Languages, i18n and Suspense

The framework uses the i18next library. Define an array of languages your app uses, using their two letter identifiers, e.g. `['en', 'nl']`. Setup an i18n config file and import that in your app. Be sure to add the i18n subcomponent configs to your main app, e.g.
```tsx
i18n.on('languageChanged', (lng) => {
  i18nLayout.changeLanguage(lng);
  i18nDeposit.changeLanguage(lng);
  i18nAuth.changeLanguage(lng);
});
```

To ensure language files are loaded before the UI is loaded, wrap your Routes in a Suspense component.

## Site title

Pass along a string as site title to the ThemeWrapper component, so the app can set the appropriate document title.

## Theming

Configure a theme file and use this in the ThemeWrapper from [@dans-framework/theme](theme.md) to wrap your app with. Be sure to edit **./src/index.css** to match body and app background color to your theme.

## App example

A sample app might look like this:
```tsx
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { ThemeWrapper } from "@dans-framework/theme";
import { LanguageBar, MenuBar, Footer } from "@dans-framework/layout";
import { Deposit } from "@dans-framework/deposit";
import { Generic, type Page } from "@dans-framework/pages";
import {
  AuthWrapper,
  AuthRoute,
  UserSettings,
  UserSubmissions,
  SignInCallback,
} from "@dans-framework/user-auth";

// Load config variables, see respective packages on how to set this up
import theme from "./config/theme";
import footer from "./config/footer";
import pages from "./config/pages";
import siteTitle from "./config/siteTitle";
import languages from "./config/languages";
import authProvider from "./config/auth";
import form from "./config/form";

const App = () => {
  const { i18n } = useTranslation();
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          {/* Need to pass along root i18n functions to the language bar */}
          <LanguageBar
            languages={languages}
            changeLanguage={i18n.changeLanguage}
          />
          <MenuBar pages={pages} />
          {/* Suspense to make sure languages can load first */}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Skeleton height={600} width={900} />
              </Box>
            }
          >
            <Routes>
              {/* Route that provides the callback URL and logic for Keycloak */}
              <Route path="signin-callback" element={<SignInCallback />} />
              <Route
                path="user-settings"
                {/* Wrap routes that need authentication in an AuthRoute component */}
                element={
                  <AuthRoute>
                    <UserSettings
                      target={form.targetCredentials}
                      depositSlug="deposit"
                    />
                  </AuthRoute>
                }
              />
              <Route
                path="user-submissions"
                element={
                  <AuthRoute>
                    <UserSubmissions />
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
                          <Deposit config={form} page={page} />
                        </AuthRoute>
                      : <Generic {...page} />
                    }
                  />
                );
              })}
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer {...footer} />
      </ThemeWrapper>
    </AuthWrapper>
  );
};
```
