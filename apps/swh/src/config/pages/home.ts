import logo from "../images/logo-black.png";
import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "home",
  name: "Home",
  slug: "",
  template: "generic",
  inMenu: true,
  menuTitle: "Home",
  content: {
    nl: `<p>Dit dynamisch formulier stelt onderzoekers in staat om moeiteloos hun software repositories samen met gerelateerde datasets te kunnen deponeren voor archivering. De broncode met de relevante metadata wordt bij Software Heritage ter archivering aangeboden en de dataset(files) met hun metadata worden in Dataverse gearchiveerd. Hierdoor zijn ze op lange termijn toegankelijk en voldoen ze aan de FAIR-principes.
    <br /> <br />
    Om gebruik te kunnen maken van dit formulier dient de onderzoeker aan een aantal voorwaarden te voldoen. Eén daarvan is een geldig account bij de betrokken Dataverse instantie.
    <br /> <br />
    Kijk voor een <a href="https://dans-labs.github.io/swh-docs/">volledig overzicht en uitgebreide handleiding</a> op onze Read the Docs, of log in om te beginnen.
    <br /> <br />
    Dit werk wordt uitgevoerd in de context van het <a href="https://faircore4eosc.eu/">FAIRCORE4EOSC</a> project (Core Components Supporting a FAIR EOSC), gefinancierd door het Horizon Europe Framework Programme (HORIZON) van de EU. Project call HORIZON-INFRA-2021-EOSC-01 onder grant agreement ID <a href="https://cordis.europa.eu/project/id/101057264">101057264</a>.</p>`,
    en: `<p>This dynamic form enables researchers to effortlessly deposit their software repositories along with related datasets for archiving. The source code and their relevant metadata is submitted to Software Heritage for archiving, while the dataset(files) and their metadata are archived in a Dataverse instance. This ensures long-term accessibility and compliance with  FAIR principles.
    <br /> <br />
    To use this form, researchers must meet certain conditions, one of which is having a valid user account with the relevant Dataverse instance.
    <br /> <br />
    For a <a href="https://dans-labs.github.io/swh-docs/">complete overview and an extensive guide</a>, please refer to our Read the Docs.
    <br /> <br />
    This work is carried out in the context of the <a href="https://faircore4eosc.eu/">FAIRCORE4EOSC</a> project (Core Components Supporting a FAIR EOSC), funded by the EU's Horizon Europe Framework Programme (HORIZON), project call HORIZON-INFRA-2021-EOSC-01 under grant agreement ID <a href="https://cordis.europa.eu/project/id/101057264">101057264</a>.</p>`,
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
