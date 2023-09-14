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
    en: "<p>DANS collaborates with the OH-SMArt project to provide infrastructure for the deposit, preservation, processing and application of audiovisual materials collected by museums and research institutions. OH-SMArt concentrates on oral histories - interviews conducted at art museums.</p>",
    nl: '<p>DANS werkt samen met het OH-SMArt project om een infrastructuur te bieden voor het indienen, verwerken, behouden en toepassen van audiovisueel materiaal dat verzameld wordt door musea en onderzoeksinstituten. OH-SMArt richt zich op mondelinge geschiedenis - interviews afgenomen bij musea.</p>',
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