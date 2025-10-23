import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "create",
  name: "Perform Assessment",
  slug: "perform-assessment",
  inMenu: true,
  menuTitle: {
    en: "Perform assessment",
    nl: "Voer beoordeling uit",
  },
  template: "create-assessment",
};

export default page;
