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
        en: "About CAT",
        nl: "Over CAT",
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
      header: "CAT Tiger",
      freetext: "CAT Fair Assesment Tool",
      links: [
        {
          name: "Contact CAT TIGER",
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
