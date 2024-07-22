import type { Page } from "@dans-framework/pages";

const depositPage: Page = {
  id: "deposit",
  name: "Deposit",
  slug: "deposit",
  template: "deposit",
  inMenu: true,
  menuTitle: "Deposit",
};

const advisorPage: Page = {
  id: "advisor",
  name: "Advisor",
  slug: "/",
  template: "deposit",
  inMenu: true,
  menuTitle: "Advisor",
};

export default [ advisorPage, depositPage ];
