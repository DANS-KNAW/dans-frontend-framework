import { useState, createContext, useContext } from "react";
import { EndpointProps, FixedFacetsProps } from "./props";

interface FCProps {
  config: EndpointProps[];
  endpoint: string;
  setEndpoint: (e: string) => void;
  fixedFacets: any[];
  setFixedFacets: (e: FixedFacetsProps[]) => void;
}
export const FacetedSearchContext = createContext<FCProps>({
  config: [],
  endpoint: "",
  setEndpoint: () => null,
  fixedFacets: [],
  setFixedFacets: () => null,
});
export const FacetedSearchProvider = ({
  config,
  children,
}: {
  config: EndpointProps[];
  children: any;
}) => {
  const [endpoint, setEndpoint] = useState<string>(config[0].url);
  const [fixedFacets, setFixedFacets] = useState<FixedFacetsProps[]>(config[0].fixedFacets?.filter(facet => facet.defaultEnabled) || []);

  return (
    <FacetedSearchContext.Provider value={{ config, endpoint, setEndpoint, fixedFacets, setFixedFacets }}>
      {children}
    </FacetedSearchContext.Provider>
  );
};
const useFacedtedContext = () => {
  return useContext(FacetedSearchContext);
};
export const getCurrentEndpoint = () => {
  const { endpoint } = useFacedtedContext();
  return endpoint;
};
