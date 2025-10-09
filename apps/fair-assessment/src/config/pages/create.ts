import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "create",
  name: "Create Assessment",
  slug: "create-assessment",
  inMenu: true,
  menuTitle: {
    en: "Create assessment",
    nl: "Maak beoordeling",
  },
  template: "create-assessment",
  content: "<p style=\"text-align: center;\">Placeholder content for create assessment page</p>",
};

export default page;
