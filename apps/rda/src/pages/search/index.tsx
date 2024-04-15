import {
  FacetedSearch,
  DateChartFacet,
  PieChartFacet,
  ListFacet,
  RDTSearchUIProps,
  Result,
} from "@dans-framework/rdt-search-ui";
import { Rda2Result } from "./result";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";

const config: Partial<RDTSearchUIProps> = {
  fullTextFields: ["title^2", "dc_description"],
  fullTextHighlight: {
    fields: {
      title: { number_of_fragments: 0 },
      dc_description: { number_of_fragments: 0 },
    },
  },
};

export function RdaSearch({dashboard}: {dashboard?: boolean}) {
  const navigate = useNavigate();
  /* 
   * Note that for the dashboard config, we use cols and rows, based on an 8 col grid. 
   * The config is for larger screens. For mobile, we use half width and full width cols.
  */
  return (
    <Container sx={{ pt: 4 }}>
      <FacetedSearch
        dashboard={dashboard}
        fullTextFields={config.fullTextFields}
        fullTextHighlight={config.fullTextHighlight}
        onClickResult={(result: Result) => navigate(`/record/${result.id}`)}
        ResultBodyComponent={Rda2Result}
        endpoints={JSON.parse(import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINTS)}
      >
        <ListFacet
          config={{
            id: "indi",
            field: "individuals.keyword",
            title: "Individuals",
            size: 10,
            cols: 2,
            rows: 2,
          }}
        />
        <DateChartFacet
          config={{
            id: "date",
            field: "dc_date",
            title: "Year",
            interval: "year",
            cols: 6,
            rows: 1,
          }}
        />
        <PieChartFacet
          config={{
            id: "rights",
            field: "resource_rights_types.keyword",
            title: "Rights",
            cols: 3,
            rows: 1,
          }}
        />
        <PieChartFacet
          config={{
            id: "lang",
            field: "dc_language.keyword",
            title: "Language",
            cols: 3,
            rows: 1,
          }}
        />
        <ListFacet
          config={{
            id: "wf",
            field: "workflows.keyword",
            title: "Workflows",
            cols: 2,
            rows: 1,
          }}
        />
        <ListFacet
          config={{
            id: "pw",
            field: "pathways.keyword",
            title: "Pathways",
            cols: 2,
            rows: 1,
          }}
        />        
        <ListFacet
          config={{
            id: "restype",
            field: "resource_type.keyword",
            title: "Resource type",
            cols: 2,
            rows: 1,
          }}
        />
        <ListFacet
          config={{
            id: "reltype",
            field: "relation_types.keyword",
            title: "Relation types",
            cols: 2,
            rows: 1,
          }}
        />
      </FacetedSearch>
    </Container>
  );
}
