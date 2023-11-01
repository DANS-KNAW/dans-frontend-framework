import type { Page } from '@dans-framework/pages';

const page: Page = {
  id: "about",
  name: {
    en: "About SWH",
    nl: "Over SWH",
  },
  slug: "about",
  template: "generic",
  inMenu: true,
  menuTitle: {
    en: "About",
    nl: "Over",
  },
  content: {
    en: "<p>About the project...</p>",
    nl: "<p>Over het project...</p>"
  },
};

export default page;