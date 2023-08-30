# DANS Metadata form application for OH-SMArt
This is a wrapper application for the components of the DANS framework. Add and configure the components you need.

## Full configuration

#### Form
The form should be an array of section objects. A section can be configured as indicated in the [@dans-framework/deposit](/packages/deposit/README.md) package.

#### Pages
The pages should be an array of page objects. A page can be configured as indicated in the [@dans-framework/pages](/packages/pages/README.md) package.

#### Footer
The footer consists of a top and bottom section. See the [@dans-framework/layout](/packages/layout/README.md) package.

#### Auth
For user authentication, you need to supply the proper OIDC configuration. See the [@dans-framework/auth](/packages/auth/README.md) package.

#### Languages, i18n and Suspense
The framework uses the i18next library. Define an array of languages your app uses, using their two letter identifiers, e.g. `['en', 'nl']`. Setup an i18n config file and import that in your app. Be sure to add the i18n subcomponent configs to your main app, e.g.

    i18n.on('languageChanged', (lng) => {
      i18nLayout.changeLanguage(lng);
      i18nDeposit.changeLanguage(lng);
      i18nAuth.changeLanguage(lng);
    });

To ensure language files are loaded before the UI is loaded, wrap your Routes in a Suspense component.

#### Theming
The DANS framework uses the [MUI library](https://mui.com/material-ui/getting-started/) and its [theming customisation](https://mui.com/material-ui/customization/theming/). Configure a theme file and use this in a ThemeProvider to wrap your app with.

    import { ThemeProvider } from '@mui/material/styles'

    <ThemeProvider theme={theme}>
      // rest of your app
    </ThemeProvider>

Note that the components use some custom colors that need to be specified in the themes color palette: **footerTop**, **footerBottom**, **neutral**.

#### Snackbar
To display error messages from the Redux stores of several components, you need to a add a SnackbarProvider somewhere in your app.

    import { SnackbarProvider } from 'notistack';

    <SnackbarProvider />

#### CSS normalisation
Ensure styling is normalised amongst different browsers. Add a CssBasline component somewhere in your app.

    import CssBaseline from '@mui/material/CssBaseline';

    <CssBaseline />