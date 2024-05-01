import { useState, cloneElement } from "react";
import {
  FacetedSearch,
  Result,
  EndpointSelector,
  type EndpointProps
} from "@dans-framework/rdt-search-ui";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { elasticConfig } from "../../config/elasticSearch";

export function RdaSearch({ dashboard, endpoint, setEndpoint }: {
  dashboard?: boolean;
  endpoint: string;
  setEndpoint: (ep: string) => void;
}) {
  // this is needed to enable endpoint toggling. See EndpointSelector component for details
  const [search, toggleSearch] = useState(true);

  const navigate = useNavigate();
  const config = elasticConfig.find( e => e.url === endpoint ) as EndpointProps;

  return (
    <Container sx={{ pt: 4 }}>
      {elasticConfig.length > 1 && 
        // show selector if there's more than 1 endpoint
        <EndpointSelector 
          endpoint={endpoint} 
          setEndpoint={setEndpoint} 
          endpoints={elasticConfig} 
          toggleSearch={toggleSearch}
        />
      }
      {search && <FacetedSearch
        dashboard={dashboard}
        fullTextFields={config.fullTextFields}
        fullTextHighlight={config.fullTextHighlight}
        onClickResult={(result: Result) => navigate(`/${config.onClickResultPath}/${result.id}`)}
        ResultBodyComponent={config.resultBodyComponent}
        url={config.url}
      >
        {config?.dashboard.map( (node, i) => 
          cloneElement(node, { key: i })
        )}
      </FacetedSearch>}
    </Container>
  );
}
