import { createContext, useContext } from "react";

// Provider and hook for global document title and meta info
const defaultSiteTitle = '';

const siteTitleContext = createContext(defaultSiteTitle);

export const SiteTitleProvider = siteTitleContext.Provider;
export const useSiteTitle = () => useContext(siteTitleContext);

export const setSiteTitle = (siteName?: string, pageName?: string) => {
    document.title = `${siteName} | ${pageName}`
};