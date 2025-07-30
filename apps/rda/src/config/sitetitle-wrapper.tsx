import { Page } from "@dans-framework/pages";
import {
  lookupLanguageString,
  setSiteTitle,
  useSiteTitle,
} from "@dans-framework/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Wrapper component that sets the site title based on the current page.
 *
 * @param children - React children to be wrapped
 * @param page - The current page object containing the name used for the site title
 * @returns JSX element that renders the children with the site title set
 */
const SiteTitleWrapper = ({
  children,
  page,
}: {
  children: React.ReactNode;
  page: Page;
}) => {
  const { i18n } = useTranslation();
  const siteTitle = useSiteTitle();

  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  return <>{children}</>;
};

export default SiteTitleWrapper;
