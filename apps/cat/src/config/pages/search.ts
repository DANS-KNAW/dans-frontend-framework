import type { Page } from "@dans-framework/pages";
import ListIcon from '@mui/icons-material/List';

const page: Page = {
  id: "search",
  name: {
    en: "Search CAT",
    nl: "Zoek CAT",
  },
  slug: "search",
  template: "search",
  inMenu: true,
  menuTitle: {
    en: "Search",
    nl: "Zoeken",
  },
  icon: ListIcon,
};

export default page;
