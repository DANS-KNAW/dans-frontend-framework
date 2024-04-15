import {
  FacetedSearch,
  DateChartFacet,
  PieChartFacet,
  ListFacet,
  RDTSearchUIProps,
  Result,
} from "@dans-framework/rdt-search-ui";
import { Fc4e2Result } from "./result";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";

const config: Partial<RDTSearchUIProps> = {
  fullTextFields: ["organisation", "dc_description"],
  fullTextHighlight: {
    fields: {
      title: { number_of_fragments: 0 },
      dc_description: { number_of_fragments: 0 },
    },
  },
};

export function FC4ESearch({
  dashboard,
}: {
  dashboard?: RDTSearchUIProps["dashboard"];
}) {
  const navigate = useNavigate();
  return (
    <Container sx={{ pt: 4 }}>
      <FacetedSearch
        dashboard={dashboard}
        fullTextFields={config.fullTextFields}
        fullTextHighlight={config.fullTextHighlight}
        onClickResult={(result: Result) => navigate(`/record/${result.id}`)}
        ResultBodyComponent={Fc4e2Result}
        endpoints={JSON.parse(import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINTS)}
      >
        <DateChartFacet
          config={{
            id: "date",
            field: "date_of_assessment,keyword",
            title: "Date of Assesment",
            interval: "year",
          }}
        />
        <ListFacet
          config={{
            id: "wf",
            field: "principle.keyword",
            title: "Principles",
          }}
        />
        <ListFacet
          config={{
            id: "pw",
            field: "subject.keyword",
            title: "Subjects",
          }}
        />
        <ListFacet
          config={{
            id: "indi",
            field: "organisation.keyword",
            title: "Organisations",
            size: 10,
          }}
        />
        <PieChartFacet
          config={{
            id: "rights",
            field: "assessment.keyword",
            title: "Assessments",
          }}
        />
        <PieChartFacet
          config={{
            id: "lang",
            field: "result.keyword",
            title: "Results",
          }}
        />
        <ListFacet
          config={{
            id: "restype",
            field: "actor.keyword",
            title: "Actors",
          }}
        />
        <ListFacet
          config={{
            id: "reltype",
            field: "criterion.keyword",
            title: "Criterions",
          }}
        />
      </FacetedSearch>
    </Container>
  );
}
