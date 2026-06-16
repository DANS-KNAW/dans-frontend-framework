import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "linkset-editor",
  name: "LinkSet Editor",
  slug: "/linkset-editor",
  template: "linkset-editor", // could use generic, just for testing
  inMenu: true,
  menuTitle: {
    en: "LinkSet Editor",
    nl: "LinkSet Editor",
  },
  content: "<p style=\"text-align: center;\">Placeholder content for LinkSet editor page</p>",
};

export default page;