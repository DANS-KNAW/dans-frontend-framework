import { Footer } from "@dans-framework/layout/src/types";
import rdaImage from "./images/logo_tiger.png";

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
        en: "About RDA",
        nl: "Over RDA",
      },
      links: [
        {
          name: {
            en: "About us",
            nl: "Over ons",
          },
          link: "",
        },
        {
          name: {
            en: "Our team",
            nl: "Ons team",
          },
          link: "",
        },
        {
          name: {
            en: "Legal information",
            nl: "Juridische informatie",
          },
          link: "",
        },
        {
          name: {
            en: "Press Releases",
            nl: "Pers",
          },
          link: "",
        },
        {
          name: {
            en: "Disclaimer",
            nl: "Disclaimer",
          },
          link: "",
        },
        {
          name: {
            en: "Data Licenses",
            nl: "Datalicenties",
          },
          link: "",
        },
        {
          name: {
            en: "Privacy",
            nl: "Privacy",
          },
          link: "",
        },
      ],
    },
    {
      header: {
        en: "Follow us",
        nl: "Volg ons",
      },
      links: [
        {
          name: "Newsletter",
          link: "",
          icon: "email",
        },
        {
          name: "YouTube",
          link: "",
          icon: "youtube",
        },
        {
          name: "Twitter",
          link: "",
          icon: "twitter",
        },
      ],
    },
    {
      header: "RDA Tiger",
      freetext: {
        en: "The RDA Tiger Project is supporting the use of this application through engagement with RDA Groups and members.",
      },
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
      freetext: {
        en: "",
        nl: "",
      },
    },
    {
      freetext: {
        en: "",
        nl: "",
      },
    },
  ],
};
export default footer;
