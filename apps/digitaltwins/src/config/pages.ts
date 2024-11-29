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
    en: "Start mapping terms",
    nl: "Start mapping terms",
  },
  slug: "map",
  template: "mapper",
  inMenu: true,
  menuTitle: {
    en: "Term mapping",
    nl: "Term mapping",
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

export default [advisorPage, depositPage, homePage];
