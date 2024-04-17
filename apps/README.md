# Metadata form application

How to set up a wrapper application for the components of the DANS framework. Import and configure the components you need.

## Dependencies and env files

Make sure required dependencies are installed in your **package.json**.

Create the appropriate **.env** files. Use the **.env** template below for your **.env.development** and **.env.production** files.

    ## DANS packaging key. Only when Keycloak is not used. Deprecated.
    VITE_PACKAGING_KEY = ''

    ## Packaging target
    VITE_PACKAGING_TARGET = ''
    VITE_ENV_NAME = ''
    VITE_CONFIG_NAME = ''

    ## Target configs. Add more where necessary.
    VITE_TARGET_1_REPO = ''
    VITE_TARGET_1_KEY_URL = ''
    VITE_TARGET_1_KEY_CHECK_URL = ''

    ## OIDC config
    VITE_OIDC_AUTHORITY = ''
    VITE_OIDC_CLIENT_ID = ''
    VITE_OIDC_SCOPE = 'openid profile'

    ## API keys
    VITE_GEONAMES_API_KEY = ''
    VITE_GSHEETS_API_KEY = ''

    ## Freshdesk ticketing
    VITE_FRESHDESK_API_KEY = ''
    VITE_FRESHDESK_URL = ''
    VITE_FRESHDESK_AGENT = ''
    VITE_FRESHDESK_GROUP = ''
    VITE_FRESHDESK_ASSIGNED_TO = ''

    ## For dev purposes
    VITE_DISABLE_AUTOSAVE = ''
    VITE_DISABLE_API_KEY_MESSAGE = ''

    ## For Elastic Search projects
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

## Form

The form should be an array of section objects. A section can be configured as indicated in the [@dans-framework/deposit](/packages/deposit/README.md) package. To be used in `<Deposit />`.

## Pages

The pages should be an array of page objects. A page can be configured as indicated in the [@dans-framework/pages](/packages/pages/README.md) package.

## Footer

The footer consists of a top and bottom section. See the [@dans-framework/layout](/packages/layout/README.md) package.

## Auth

For user authentication, you need to supply the proper OIDC configuration. See the [@dans-framework/user-auth](/packages/auth/README.md) package.

## Languages, i18n and Suspense

The framework uses the i18next library. Define an array of languages your app uses, using their two letter identifiers, e.g. `['en', 'nl']`. Setup an i18n config file and import that in your app. Be sure to add the i18n subcomponent configs to your main app, e.g.

    i18n.on('languageChanged', (lng) => {
      i18nLayout.changeLanguage(lng);
      i18nDeposit.changeLanguage(lng);
      i18nAuth.changeLanguage(lng);
    });

To ensure language files are loaded before the UI is loaded, wrap your Routes in a Suspense component.

## Site title

Pass along a string as site title to the ThemeWrapper component, so the app can set the appropriate document title.

## Theming

Configure a theme file and use this in the ThemeWrapper from [@dans-framework/theme](/packages/theme/README.md) to wrap your app with. Be sure to edit **./src/index.css** to match body and app background color to your theme.

## Snackbar

To display error messages from the Redux stores of several components, you need to a add a SnackbarProvider somewhere in your app.

    import { SnackbarProvider } from 'notistack';

    <SnackbarProvider />
