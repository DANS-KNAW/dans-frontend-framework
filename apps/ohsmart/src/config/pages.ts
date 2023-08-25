import logo from './images/logo.png';
import type { Template } from '@dans-framework/pages';

const pages = [
  {
    id: "home",
    name: "Home",
    slug: "",
    template: "generic" as Template,
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
  },
  {
    id: "deposit",
    name: "Deposit",
    slug: "deposit",
    template: "deposit" as Template,
    inMenu: true,
    restricted: true,
    menuTitle: {
      en: "Deposit",
      nl: "Indienen",
    },
  },
  {
    id: "about",
    name: {
      en: "About OH-SMArt",
      nl: "Over OH-SMArt",
    },
    slug: "about",
    template: "generic" as Template,
    inMenu: true,
    menuTitle: {
      en: "About",
      nl: "Over",
    },
    content: {
      en: "<p>About the project...</p>",
      nl: "<p>Over het project...</p>"
    },
  },
  {
    id: "search",
    name: "Search",
    slug: "search",
    template: "generic" as Template,
    inMenu: true,
    menuTitle: {
      en: "Search",
      nl: "Zoeken",
    },
  },
  {
    id: "guide",
    name: "User guide",
    slug: "guide",
    template: "generic" as Template,
    inMenu: true,
    menuTitle: {
      en: "User guide",
      nl: "Gebruikersgids",
    },
  },
  {
    id: "support",
    name: "Support",
    slug: "support",
    template: "generic" as Template,
    inMenu: true,
    menuTitle: {
      en: "Support",
      nl: "Ondersteuning",
    },
  }
];

export default pages;