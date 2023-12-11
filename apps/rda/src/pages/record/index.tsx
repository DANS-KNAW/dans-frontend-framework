import { Chip, Container } from "@mui/material";
import type { Result } from "@dans-framework/rdt-search-ui";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

interface RdaRecord {
  card_url: string;
  dc_date: string;
  dc_description: string;
  dc_language: string;
  dc_type: string;
  individuals: string[];
  page_url: string;
  pathways: string[];
  pid_lod: string;
  pid_lod_type: string;
  relation_types: string;
  resource_rights_types: string;
  resource_type: string;
  spec_url: string;
  title: string;
  uri: string;
  uuid: string;
  uuid_rda: string;
  uuid_resource: string;
  workflows: string[];
  workinggroupstring: string;
}

export function RdaRecord() {
  const { id } = useParams();
  const [record, setRecord] = React.useState<RdaRecord | null>(null);

  React.useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT
      }/dans-rda2/_source/${id}`,
    )
      .then((res) => res.json())
      .then(setRecord);
  }, [id]);

  if (record == null) return;

  return (
    <Container>
      <Grid container>
        <Grid
          sm={10}
          md={8}
          lg={7}
          smOffset={1}
          mdOffset={2}
          lgOffset={2.5}
          pt={4}
        >
          <Typography variant="h3">
            {record.title || <i>Untitled</i>}
          </Typography>
          <Typography gutterBottom>{record.dc_description || ""}</Typography>

          <MetadataList record={record} />

          <div style={{ margin: "2rem 0" }}>
            {record.page_url && (
              <a href={record.page_url} style={{ marginRight: "1rem" }}>
                <Chip label="RDA" />
              </a>
            )}
            {record.uri && (
              <a href={record.uri} style={{ marginRight: "1rem" }}>
                <Chip label="Zenodo" />
              </a>
            )}
            {record.pid_lod && (
              <a href={record.pid_lod}>
                <Chip label="DOI" />
              </a>
            )}
          </div>
          <ShowJSON record={record} />
        </Grid>
      </Grid>
    </Container>
  );
}

const style = {
  display: "grid",
  gridTemplateColumns: "1fr 4fr",
  marginBottom: "0.25rem",
};

function Metadata({ name, value }: { name: string; value: string | string[] }) {
  if (value == null) return null;

  const _value = Array.isArray(value) ? value.join(" / ") : value;

  return (
    <div style={style}>
      <Typography variant="body2" color="neutral.dark" pr={1}>
        {name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {_value}
      </Typography>
    </div>
  );
}

export function MetadataList({ record }: { record: RdaRecord | Result }) {
  return (
    <div>
      {record.dc_language && (
        <Metadata name="Language" value={record.dc_language} />
      )}
      <Metadata name="Individuals" value={record.individuals} />
      <Metadata name="Rights" value={record.resource_rights_types} />
      <Metadata name="Relations" value={record.relation_types} />
      <Metadata name="Workflows" value={record.workflows} />
      <Metadata name="Pathways" value={record.pathways} />
    </div>
  );
}

function ShowJSON({ record }: { record: RdaRecord }) {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <Button onClick={() => setActive(!active)} variant="contained">
        {active ? "Hide" : "Show"} JSON
      </Button>
      {active && (
        <pre
          style={{
            background: "rgba(0,0,0,0.1)",
            padding: "1rem",
            overflow: "auto",
          }}
        >
          {JSON.stringify(record, undefined, 3)}
        </pre>
      )}
    </>
  );
}
