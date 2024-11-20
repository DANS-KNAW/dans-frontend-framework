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
  id: "advisor",
  name: {
    en: "Repository selector",
    nl: "Repository selector",
  },
  slug: "/",
  template: "advisor",
  inMenu: true,
  menuTitle: {
    en: "Repository selector",
    nl: "Repository selector",
  },
};

export default [advisorPage, depositPage];
