import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "record",
  name: "Record",
  slug: "record/:id",
  template: "record",
  inMenu: false,
  menuTitle: {
    en: "Record",
    nl: "Dossier",
  },
};

export default page;
