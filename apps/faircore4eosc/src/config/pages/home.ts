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
    en: "<p style='text-align: center'>FAIRCORE4EOSC demo submission app. Log in and deposit your data.</p>",
    nl: "<p style='text-align: center'>FAIRCORE4EOSC demo submission app</p>",
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