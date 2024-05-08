import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "search",
  name: {
    en: "Search CAT",
    nl: "Zoek CAT",
  },
  slug: "search",
  template: "search",
  inMenu: true,
  menuTitle: {
    en: "Search",
    nl: "Zoeken",
  },
};

export default page;
