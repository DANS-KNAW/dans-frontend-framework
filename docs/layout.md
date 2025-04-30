# Layout package

Package that exports several layout components for use in your form application.

## Language bar

Display a language bar with country flags.

```tsx
import { LanguageBar } from @dans-framework/layout;

<LanguageBar
  // Languages need to be defined by their 2 letter code, e.g. 'en'. Make sure the appropriate translations are present.
  languages={ ['en', 'nl'] }
  // Function to change the language of the root app, usually i18n.changeLanguage
  changeLanguage={ (lang) => void }
/>
```

## Menu bar

The navigation menu of your app. Takes an array of Page props. See [@dans-framework/pages](pages.md). Also see [@dans-framework/utils](utils.md) for a handy useEmbedHandler hook.

```tsx
import { MenuBar } from @dans-framework/layout;

<MenuBar 
  pages={pages} 
  userMenu={true} // of set to false, no user settings and submissions menu will be present
  embed={false} // if set to true, it will show a different style of menu bar, suitable to an embedded view, for e.g. iFrames.
/>
```

## Footer

The footer menu of your app.

```tsx
import { Footer } from @dans-framework/layout

<Footer
  // Top and bottom contain an array of footer items. Top should ideally be an of with 4 items, bottom of 2.
  top=[{...}]
  bottom=[{...}]
/>
```

A footer item is formatted as follows:

```tsx
{
  // a string or a language object, appears above a footer section
  header: {
    en: '',
    nl: '',
  },
  // an array of links that appear below the header
  links: [{
    name: '', // or language object
    link: '', // a URL
    icon: '' // optionally a material icon identifier, can be 'twitter', 'youtube', 'email' for now
  }];
  // instead of a link, display some text
  freetext: 'some text' // Can be a string or language object
}
```

## i18n

Exposes the Layout components language config. Use this in the main apps language config.

```tsx
import { i18n as i18nLayout } from "@dans-framework/layout";
```
