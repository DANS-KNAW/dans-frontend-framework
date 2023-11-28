import { Footer } from '@dans-framework/layout/src/types';
import rdaImage from './images/logo_tiger.png';

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
      ]
    },
    {
      header: { 
        en: "About 4TU",
        nl: "Over 4TU",
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
      ]
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
          icon: "email"
        },
        {
          name: "YouTube",
          link: "",
          icon: "youtube"
        },
        {
          name: "Twitter",
          link: "",
          icon: "twitter"
        }
      ]
    },
  ],
  bottom: [
    {
      freetext: {
        en: "",
        nl: "",
      }
    },
    {
      freetext: {
        en: "",
        nl: "",
      }
    }
  ],
}
export default footer;