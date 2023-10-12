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
    en: "<p>DANS collaborates with the RDA to provide infrastructure for the deposit, preservation, processing and application of...</p>",
    nl: '<p>DANS werkt samen met de RDA om een infrastructuur te bieden voor het indienen, verwerken, behouden en toepassen van...</p>',
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