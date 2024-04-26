# Helper utilities

## @dans-framework/utils/language

```tsx
import { lookupLanguageString } from "@dans-framework/utils";
```

Returns a language sensitive string from a languageObject like `{en: '', nl: ''}`. Can also take a plain string as argument and will return that same string.

```js
lookupLanguageString(
  languageObject, // can also be a string
  language, // current language, usually i18n.language
);
```

## @dans-framework/utils/error

```tsx
import { errorLogger } from "@dans-framework/utils";
```

Helper function to show errors created by RTK as popup notification. Import in a store and add it to the middleware of the store config.

```js
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(errorLogger);
```

Sends tickets to Freshdesk, if Freshdesk data is configured in your .env file.

## @dans-framework/utils/sitetitle

```tsx
import { SiteTitleProvider, useSiteTitle } from "@dans-framework/utils";
```

Provides and gets context for site title, which needs to be set on every page change.

```tsx
import { setSiteTitle } from "@dans-framework/utils";
```

Function to set document title `setSiteTitle('site name', 'page title')`
