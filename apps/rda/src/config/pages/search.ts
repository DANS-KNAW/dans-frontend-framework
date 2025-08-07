import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "search",
  name: {
    en: "Search Knowledge Base",
    nl: "Zoek door Kennisbank",
  },
  slug: "search",
  template: "search",
  inMenu: false,
  menuTitle: {
    en: "Search",
    nl: "Zoeken",
  },
};

export default page;
