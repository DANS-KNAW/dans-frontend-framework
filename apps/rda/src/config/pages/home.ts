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
    en: "<p>Welcome to the RDA deposit tool. Log in and deposit your research data using our form.</p>",
    nl: '<p>Welkom bij de RDA deposit tool. Log in en stuur je onderzoeksdata op via ons formulier.</p>',
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