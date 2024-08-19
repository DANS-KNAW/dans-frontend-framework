import type { Page } from "@dans-framework/pages";

const depositPage: Page = {
  id: "deposit",
  name: {
    en: "Deposit",
    nl: "Deponeren",
  },
  slug: "deposit",
  template: "deposit",
  inMenu: true,
  menuTitle: {
    en: "Deposit",
    nl: "Deponeren",
  },
};

const advisorPage: Page = {
  id: "mapper",
  name: {
    en: "Map your data",
    nl: "Map your data",
  },
  slug: "map",
  template: "mapper",
  inMenu: true,
  menuTitle: {
    en: "Map data",
    nl: "Map data",
  },
};


const homePage: Page = {
  id: "home",
  name: "Home",
  slug: "/",
  template: "generic",
  inMenu: true,
  menuTitle: "Home",
  content: {
    en: "<p>Some text</p>",
    nl: "<p>Wat tekst</p>",
  },
  action: {
    link: "map",
    text: {
      en: "Map your data",
      nl: "Data mappen",
    },
    restricted: true,
  },
};


export default [ advisorPage, depositPage, homePage ];
