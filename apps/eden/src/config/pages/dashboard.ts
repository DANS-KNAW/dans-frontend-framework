import type { Page } from "@dans-framework/pages";
import DashboardIcon from '@mui/icons-material/Dashboard';

const page: Page = {
  id: "dashboard",
  name: "Dashboard",
  slug: "/",
  template: "dashboard",
  inMenu: true,
  menuTitle: {
    en: "Explore",
    nl: "Verken",
  },
  icon: DashboardIcon,
};

export default page;
