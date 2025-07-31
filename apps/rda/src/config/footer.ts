import { Footer } from "@dans-framework/layout/src/types";
import rdaImage from "./images/logo_tiger.png";
import rdaTiger from "./images/rda-tiger.svg";

const footer: Footer = {
  top: [
    {
      header: {
        en: "Contact and service",
        nl: "Contact en service",
      },
      links: [
        {
          name: {
            en: "Contact",
            nl: "Contact",
          },
          link: "",
        },
        {
          name: {
            en: "Helpdesk",
            nl: "Helpdesk",
          },
          link: "",
        },
      ],
    },
    {
      header: {
        en: "About RDA TIGER",
        nl: "Over RDA TIGER",
      },
      links: [
        {
          name: {
            en: "About us",
            nl: "Over ons",
          },
          link: "https://www.rd-alliance.org/working-groups/rda-tiger/",
        },
        {
          name: {
            en: "Privacy Statement",
            nl: "Privacyverklaring",
          },
          link: "",
        },
      ],
    },
    {
      header: "RDA Tiger",
      freetext:
        "The RDA Tiger Project is supporting the use of this application through engagement with RDA Groups and members.",
      links: [
        {
          name: "Contact RDA TIGER",
          link: "",
        },
      ],
    },
    {
      image: {
        src: rdaImage,
        alt: "DANS Logo",
      },
    },
  ],
  bottom: [
    {
      image: {
        src: rdaTiger,
        alt: "RDA TIGER PROJECT",
        width: 300,
      },
    },
    {
      freetext: {
        en: "This project has received funding from the European Union’s Horizon Europe framework programme under grant agreement No. 101094406. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Research Executive Agency. Neither the European Union nor the European Research Executive Agency can be held responsible for them.",
        nl: "Dit project is gefinancierd door het Horizon Europe-programma van de Europese Unie onder subsidieovereenkomst nr. 101094406. De opvattingen en meningen die hierin worden gepresenteerd, zijn echter die van de auteur(s) en weerspiegelen niet noodzakelijkerwijs die van de Europese Unie of het Europees Uitvoerend Agentschap voor Onderzoek. Noch de Europese Unie, noch het Europees Uitvoerend Agentschap voor Onderzoek kan hiervoor verantwoordelijk worden gehouden.",
      },
    },
  ],
};
export default footer;
