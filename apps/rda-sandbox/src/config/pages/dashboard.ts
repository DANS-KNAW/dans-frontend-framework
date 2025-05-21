import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "dashboard",
  name: "Dashboard",
  slug: "/",
  template: "dashboard",
  inMenu: true,
  menuTitle: {
    en: "Discovery",
    nl: "Ontdekken",
  },
};

export default page;
