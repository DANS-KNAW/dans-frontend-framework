import { useState, createContext, useContext } from "react";
import { EndpointProps } from "./props";

interface FCProps {
  config: EndpointProps[];
  endpoint: string;
  setEndpoint: (e: string) => void;
  fixedFacets: any[];
  setFixedFacets: (e: string) => void;
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
  const [fixedFacets, setFixedFacets] = useState([]);

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
