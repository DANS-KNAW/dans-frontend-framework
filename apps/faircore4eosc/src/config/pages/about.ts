import type { Page } from '@dans-framework/pages';

const page: Page = {
  id: "about",
  name: {
    en: "About FAIRCORE4EOSC",
    nl: "Over FAIRCORE4EOSC",
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