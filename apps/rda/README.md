# DANS Metadata form application for OH-SMArt
This is a wrapper application for the components of the DANS framework. Add and configure the components you need.

## Configuration and usage
Make sure required dependencies are installed in your **package.json**.

Create the appropriate **.env** files. Use **.env** as a template for your **.env.development** and **.env.production** files.

#### Form
The form should be an array of section objects. A section can be configured as indicated in the [@dans-framework/deposit](/packages/deposit/README.md) package. To be used in `<Deposit />`.

#### Pages
The pages should be an array of page objects. A page can be configured as indicated in the [@dans-framework/pages](/packages/pages/README.md) package.

#### Footer
The footer consists of a top and bottom section. See the [@dans-framework/layout](/packages/layout/README.md) package.

#### Auth
For user authentication, you need to supply the proper OIDC configuration. See the [@dans-framework/user-auth](/packages/auth/README.md) package.

#### Languages, i18n and Suspense
The framework uses the i18next library. Define an array of languages your app uses, using their two letter identifiers, e.g. `['en', 'nl']`. Setup an i18n config file and import that in your app. Be sure to add the i18n subcomponent configs to your main app, e.g.

    i18n.on('languageChanged', (lng) => {
      i18nLayout.changeLanguage(lng);
      i18nDeposit.changeLanguage(lng);
      i18nAuth.changeLanguage(lng);
    });

To ensure language files are loaded before the UI is loaded, wrap your Routes in a Suspense component.

#### Site title
Pass along a string as site title to the ThemeWrapper component, so the app can set the appropriate document title.

#### Theming
Configure a theme file and use this in the ThemeWrapper from [@dans-framework/theme](/packages/theme/README.md) to wrap your app with. Be sure to edit **./src/index.css** to match body and app background color to your theme.

#### Snackbar
To display error messages from the Redux stores of several components, you need to a add a SnackbarProvider somewhere in your app.

    import { SnackbarProvider } from 'notistack';

    <SnackbarProvider />

### Elastic API
The search discovery domain of the framework needs an elasticsearch endpoint simply the domain that directs to elesticsearch port 9200 is enough.

## How to integrate RDT search package
***Note:*** This package will be made more easily avaiable but at this point in time it is not so this is the easiest workaround.

---
- The repo for the rdt-search-ui lives here: https://github.com/danspartners/rdt-search-ui
- You need to clone it to the directory `packages/`.
- Inside the repo change the package.json name from to:
```json
// From
{
    "name": "rdt-search-ui",
}

// To
{
    "name": "@dans-framework/rdt-search-ui",
}
```

- Build the rdt-search-ui by running both:
```bash
 npm run watch
 # and afterwards
 npm run watch:types
```
- Lastly install all workspace package again:
```bash
 pnpm i
```