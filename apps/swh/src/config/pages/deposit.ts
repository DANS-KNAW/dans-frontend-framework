import type { Page } from '@dans-framework/pages';

const page: Page = {
  id: "deposit",
  name: "Deposit",
  slug: "deposit",
  template: "deposit",
  inMenu: true,
  restricted: true,
  menuTitle: {
    en: "Deposit",
    nl: "Indienen",
  },
};

export default page;