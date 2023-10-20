import logo from '../images/logo.png';
import type { Page } from '@dans-framework/pages';

const page: Page = {
  id: "home",
  name: "Home",
  slug: "",
  template: "generic",
  inMenu: true,
  menuTitle: "Home",
  content: {
    en: "<p>You need to log in to deposit materials to RDA collections in Zenodo. You can do so using a Google account or an ORCID.</p>",
    nl: "<p>U moet inloggen om materialen te deponeren in RDA-collecties in Zenodo. U kunt dit doen met een Google-account of een ORCID.</p>",
  },
  action: {
    link: "deposit",
    text: {
      en: "Deposit data",
      nl: "Data indienen",
    },
    restricted: true,
  },
  logo: logo,
};

export default page;