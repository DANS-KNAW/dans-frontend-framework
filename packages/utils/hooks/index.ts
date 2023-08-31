import { createContext, useContext } from "react";

const defaultSiteInfo = {
	name: '',
	description: '',
};

const siteInfoContext = createContext(defaultSiteInfo);

export const SiteInfoProvider = siteInfoContext.Provider;
export const useSiteInfo = () => useContext(siteInfoContext);