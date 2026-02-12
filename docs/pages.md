# Pages package

The Pages component makes up the pages of the applications. Only exports a Generic page component at the moment.

```tsx
import { Generic } from '@dans-framework/pages'

<Generic props=
  {
    // unique identifier
    id: "page_id",

    // appears in page content in H1 tag. Can be a string, or a language object.
    name: {
      en: "Page name",
      nl: "Pagina naam"
    },

    // permalink URL
    slug: "page_slug",

    /**
     * template to be used by the page
     * generic: a simple page with html or text content, provided by the content prop
     * deposit: for using the deposit package
     * search: for using the search interface of the rdt-search-ui package
     * record: for using the result detail page of the rdt-search-ui package
     * dashboard: for using the dashboard interface of the rdt-search-ui package
     * advisor: for using the repository advisor package
     * mapper: for using the file-mapper pacakge
     * rda-anotator: for using the rda annotator
     * accessibility-statement: for displaying an accessibility statement
    **/
    template: "generic",

    // Show this page in the menu bar
    inMenu: true,

    // Title of page in menu bar. Can be a string, or a language object
    menuTitle: "Menu title",

    // HTML formatted page content. Can be a string, or a language object. Not needed for a deposit type page.
    content: "<p>...</p>",

    // Optional action button
    action: {
      // slug the button links to
      link: "link_to_slug",
      // button text, can be a string, or a language object
      text: "Button text",
      // only display this button if user is logged in, otherwise show a login button
      restricted: true,
    },

    // if true, only logged in users can access this page
    restricted: true,

    // Optional page logo.
    logo: <image_file />

    // Optional external link. Slug not needed in this case.
    link: "uri string",

    // Open link in a new tab
    newTab: true,

    // Optionally displays an icon instead of text in the menu bar, import e.g. from Material Icons
    icon: <SomeIcon />
  }
/>
```
