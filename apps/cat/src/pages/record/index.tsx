import { Container } from "@mui/material";
import { getCurrentEndpoint, type Result } from "@dans-framework/rdt-search-ui";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

interface CatRecord {
  uuid_pidstack: string;
  pid_stack: string;
  entity: string;
  role: string;
  namespace: string;
  readability: string;
  resolutionpoint: string;
  resolutionchannel: string;
  negotiationtype: string;
  resolverapi: string;
  metaresolveravailable: string;
  multipleresolution: string;
  metadatasupportoptions: string;
  metadataschematype: string;
  metadatavariation: string;
  governanceoptions: string;
  technicalsustainability: string;
  financialsustainability: string;
  scalability: string;
  posi: string;
  valueaddedservice: string;
  servicequality: string;
  informationintegrity: string;
  certification: string;
}

export function RdaRecord() {
  const { id } = useParams();
  const [record, setRecord] = React.useState<CatRecord | null>(null);
  const endpoint = getCurrentEndpoint();

  React.useEffect(() => {
    fetch(`${endpoint}/_source/${id}`)
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
            {`${record.pid_stack} - ${record.entity} - ${record.role}` || (
              <i>Untitled</i>
            )}
          </Typography>

          <Metadata
            name="UUID PID Stack"
            value={record.uuid_pidstack}
            options={{ turnicate: false }}
          />
          <Metadata
            name="PID Stack"
            value={record.pid_stack}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Entity"
            value={record.entity}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Role"
            value={record.role}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Namespace"
            value={record.namespace}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Readability"
            value={record.readability}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Resolution Point"
            value={record.resolutionpoint}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Resolution Channel"
            value={record.resolutionchannel}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Negotiation Type"
            value={record.negotiationtype}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Resolver API"
            value={record.resolverapi}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Meta Resolver Available"
            value={record.metaresolveravailable}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Multiple Resolution"
            value={record.multipleresolution}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Metadata Support Options"
            value={record.metadatasupportoptions}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Metadata Schema Type"
            value={record.metadataschematype}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Metadata Variation"
            value={record.metadatavariation}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Governance Options"
            value={record.governanceoptions}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Technical Sustainability"
            value={record.technicalsustainability}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Financial Sustainability"
            value={record.financialsustainability}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Scalability"
            value={record.scalability}
            options={{ turnicate: false }}
          />
          <Metadata
            name="POSI"
            value={record.posi}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Value Added Service"
            value={record.valueaddedservice}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Service Quality"
            value={record.servicequality}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Information Integrity"
            value={record.informationintegrity}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Certification"
            value={record.certification}
            options={{ turnicate: false }}
          />

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

function Metadata({
  name,
  value,
  options = {
    turnicate: true,
  },
}: {
  name: string;
  value: string | string[];
  options?: { turnicate: boolean };
}) {
  if (value == null) return null;

  const _value = Array.isArray(value) ? value.join(" || ") : value;

  return (
    <div style={style}>
      <Typography variant="body2" color="neutral.dark" pr={1}>
        {name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          overflow: options?.turnicate ? "hidden" : "unset",
          whiteSpace: options?.turnicate ? "nowrap" : "normal",
          textOverflow: options?.turnicate ? "ellipsis" : "unset",
          overflowWrap: "break-word",
        }}
      >
        {_value}
      </Typography>
    </div>
  );
}

export function MetadataList({ record }: { record: CatRecord | Result }) {
  return (
    <div>
      <Metadata
        name="Entity"
        value={record.entity}
        options={{ turnicate: false }}
      />
      <Metadata
        name="Role"
        value={record.role}
        options={{ turnicate: false }}
      />
      <Metadata
        name="Namespace"
        value={record.namespace}
        options={{ turnicate: false }}
      />
    </div>
  );
}

function ShowJSON({ record }: { record: CatRecord }) {
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
