# Pages package

The Pages component makes up the pages of the applications. Only exports a Generic page component at the moment.

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

        // template must be either 'generic' or 'deposit'
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
        logo: <image_file>

        // Optional external link. Slug not needed in this case.
        link: "uri string",

        // Open link in a new tab
        newTab: true,
      }
    />
