import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "home",
  name: "Home",
  slug: "/",
  template: "generic",
  inMenu: true,
  menuTitle: "Home",
  content: {
    en: "<p></p>",
    nl: "<p></p>",
  },
  action: {
    link: "deposit",
    text: {
      en: "Deposit data",
      nl: "Data indienen",
    },
    restricted: true,
  },
};

export default page;
