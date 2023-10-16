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
<<<<<<< HEAD
    en: "<p style='text-align: center'>FAIRCORE4EOSC demo submission app. Log in and deposit your data.</p>",
    nl: "<p style='text-align: center'>FAIRCORE4EOSC demo submission app</p>",
=======
    en: "<p>DANS is actively involved in the FAIRCORE4EOSC project, a pivotal initiative that aims to standardize and improve the Findability, Accessibility, Interoperability, and Reusability (FAIR) of research data across Europe. One of the project's key deliverables is a dynamic form that allows researchers to effortlessly deposit their software or dataset repositories. These resources are then preserved and managed in structures such as Software Heritage, ensuring long-term accessibility and compliance with FAIR principles. Wim Hugo from DANS serves as a co-chair on the Technical Bridging Team, contributing valuable insights to align and integrate FAIR guidelines within the European Open Science Cloud (EOSC).</p>",
    nl: "<p>DANS is actief betrokken bij het FAIRCORE4EOSC-project, een cruciaal initiatief dat tot doel heeft de vindbaarheid, toegankelijkheid, interoperabiliteit en herbruikbaarheid (FAIR) van onderzoeksgegevens in heel Europa te standaardiseren en te verbeteren. Een van de belangrijkste resultaten van het project is een dynamisch formulier waarmee onderzoekers moeiteloos hun software- of datasetrepositories kunnen deponeren. Deze bronnen worden vervolgens bewaard en beheerd in structuren zoals Software Heritage, zodat ze op lange termijn toegankelijk zijn en voldoen aan de FAIR-principes. Wim Hugo van DANS is co-voorzitter van de Technical Bridging Team en levert waardevolle inzichten om FAIR-richtlijnen af te stemmen en te integreren binnen de European Open Science Cloud (EOSC).</p>",
>>>>>>> 4adced1 (Changed OHSMART branding to FC4E)
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