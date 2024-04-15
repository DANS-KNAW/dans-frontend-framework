import { Chip, Container } from "@mui/material";
import type { Result } from "@dans-framework/rdt-search-ui";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

interface FC4ERecord {
  organisation: string;
  actor: string;
  principle: string;
  subject: string;
  subject_uri: string;
  date_of_assessment: string;
  assessment: string;
  criterion: string;
  result: string;
  imperative: string;
}

export function FC4ERecord() {
  const { id } = useParams();
  const [record, setRecord] = React.useState<FC4ERecord | null>(null);

  React.useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT
      }/dans-fc4e/_source/${id}`,
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
            {`${record.organisation} - ${record.result}` || <i>Untitled</i>}
          </Typography>

          <MetadataList record={record} />

          <div style={{ margin: "2rem 0" }}>
            {record.subject_uri && (
              <a href={record.subject_uri} style={{ marginRight: "1rem" }}>
                <Chip label="Subject URI" />
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

export function MetadataList({ record }: { record: FC4ERecord | Result }) {
  return (
    <div>
      <Metadata name="Date of Assessment" value={record.date_of_assessment} />
      {record.actor && (
        <Metadata name="Actors" value={record.actor} />
      )}
      <Metadata name="Principle" value={record.principle} />
      <Metadata name="Subject" value={record.subject} />
      <Metadata name="Assessment" value={record.assessment} />
      <Metadata name="Criterion" value={record.criterion} />
      <Metadata name="Result" value={record.result} />
      <Metadata name="Imperative" value={record.imperative} />
    </div>
  );
}

function ShowJSON({ record }: { record: FC4ERecord }) {
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
