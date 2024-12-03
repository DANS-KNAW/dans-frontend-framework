import { useState, createContext, useContext } from "react";
import { EndpointProps } from "./props";

interface FCProps {
  config: EndpointProps[];
  endpoint: string;
  setEndpoint: (e: string) => void;
}
export const FacetedSearchContext = createContext<FCProps>({
  config: [],
  endpoint: "",
  setEndpoint: () => null,
});
export const FacetedSearchProvider = ({
  config,
  children,
}: {
  config: EndpointProps[];
  children: any;
}) => {
  const [endpoint, setEndpoint] = useState<string>(config[0].url);
  return (
    <FacetedSearchContext.Provider value={{ config, endpoint, setEndpoint }}>
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
