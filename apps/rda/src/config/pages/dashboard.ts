import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "dashboard",
  name: {
    en: "Knowledge Base",
    nl: "Kennisbank",
  },
  slug: "/",
  template: "dashboard",
  inMenu: true,
  menuTitle: {
    en: "Discovery",
    nl: "Ontdekken",
  },
};

export default page;
