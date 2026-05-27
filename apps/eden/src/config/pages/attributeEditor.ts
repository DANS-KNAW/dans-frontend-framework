import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "attribute-editor",
  name: "Attribute Editor",
  slug: "/attribute-editor",
  template: "attribute-editor", // could use generic, just for testing
  inMenu: true,
  menuTitle: {
    en: "Attribute Editor",
    nl: "Attribuut Editor",
  },
  content: "<p style=\"text-align: center;\">Placeholder content for attribute editor page</p>",
};

export default page;