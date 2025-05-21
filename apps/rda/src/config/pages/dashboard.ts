import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "dashboard",
  name: "Dashboard",
  slug: "/",
  template: "dashboard",
  inMenu: true,
  menuTitle: {
    en: "Dashboard/List",
    nl: "Dashboard/Lijst",
  },
};

export default page;
