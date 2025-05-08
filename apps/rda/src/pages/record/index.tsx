import { Chip, Container, Link } from "@mui/material";
import { getCurrentEndpoint, type Result } from "@dans-framework/rdt-search-ui";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import orcid from "../../config/images/orcid.png";

interface RdaRecord {
  card_url: string;
  dc_date: string;
  dc_description: string;
  dc_language: string;
  dc_type: string;
  individuals: {
    fullName: string;
    identifier_type: string;
    identifier: string;
  }[];
  page_url: string;
  pathways?: {
    uuid_pathway: string;
    pathway: string;
    description: string;
    datasource: string;
    relation: string;
  }[];
  interest_groups?: {
    uuid_interestgroup: string;
    relation: string;
    title: string;
    description: string;
    uuid_domain: string;
    domains: string;
    url: string;
  }[];
  working_groups?: {
    uuid_workinggroup: string;
    title: string;
    description: string;
    uuid_domain: string;
    domains: string;
    url: string;
    relation: string;
  }[];
  gorc_elements?: {
    uuid_element: string;
    element: string;
    description: string;
  }[];
  gorc_attributes?: {
    uuid_attribute: string;
    attribute: string;
    description: string;
  }[];
  disciplines?: {
    "#": string;
    uuid: string;
    list_item: string;
    description: string;
    description_source: string;
    _taxonomy_parent: string;
    _taxonomy_terms: string;
    uuid_parent: string;
    url: string;
  }[];
  pid_lod: string;
  pid_lod_type: string;
  relation_types: string;
  rights: {
    lod_pid: string;
    description: string;
    type: string;
    status: string;
  }[];
  resource_type: string;
  spec_url: string;
  title: string;
  uri: string;
  uuid: string;
  uuid_rda: string;
  uuid_resource: string;
  workflows: string[];
  fragment: string;
}

export function RdaRecord() {
  const { id } = useParams();
  const [record, setRecord] = React.useState<RdaRecord | null>(null);
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
            {record.title || <i>Untitled</i>}
          </Typography>
          <Typography gutterBottom>{record.dc_description || ""}</Typography>
          {record.fragment && (
            <>
              <Typography variant="h5">Fragment</Typography>
              <Typography gutterBottom>{record.fragment || ""}</Typography>
            </>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: "0.25rem",
            }}
          >
            <Typography variant="body2" color="neutral.dark" pr={1}>
              Individuals
            </Typography>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {record.individuals?.length ? (
                record.individuals.map((i) =>
                  i.identifier_type === "ORCID" && i.identifier ? (
                    <Link
                      key={i.fullName}
                      href={`https://orcid.org/${i.identifier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                      }}
                    >
                      {i.fullName}
                      <img
                        src={orcid}
                        alt="ORCID"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginLeft: "0.5rem",
                          verticalAlign: "middle",
                        }}
                      />
                    </Link>
                  ) : (
                    <Typography
                      key={i.fullName}
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {i.fullName}
                    </Typography>
                  )
                )
              ) : (
                <Typography variant="body2">-</Typography>
              )}
            </div>
          </div>

          <Metadata
            name="Pathways"
            value={record.pathways?.map((p) => p.pathway) ?? ["-"]}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Interest Groups"
            value={record.interest_groups?.map((ig) => ig.title) ?? ["-"]}
            options={{ turnicate: false }}
          />
          <Metadata
            name="Working Groups"
            value={record.working_groups?.map((wg) => wg.title) ?? ["-"]}
            options={{ turnicate: false }}
          />
          <Metadata
            name="GORC Elements"
            value={record.gorc_elements?.map((gorce) => gorce.element) ?? ["-"]}
            options={{ turnicate: false }}
          />
          <Metadata
            name="GORC Attributes"
            value={
              record.gorc_attributes?.map((gorca) => gorca.attribute) ?? ["-"]
            }
            options={{ turnicate: false }}
          />
          <Metadata
            name="Domains"
            value={
              record.disciplines?.map((discipline) => discipline.list_item) ?? [
                "-",
              ]
            }
            options={{ turnicate: false }}
          />
          {/* <MetadataList record={record} /> */}
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

  let _value = Array.isArray(value) ? value.join(" || ") : value;

  if (_value.length < 1) {
    _value = "-";
  }

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

export function MetadataList({ record }: { record: RdaRecord | Result }) {
  const individuals = record.individuals
    ? record.individuals.map((i: any) => i.fullName)
    : [];
  const workflows = record.workflows
    ? record.workflows.map((w: any) => w.WorkflowState)
    : [];
  const rights = record.rights
    ? record.rights.map((r: any) => r.description)
    : [];
  const pathways = record.pathways
    ? record.pathways.map((p: any) => p.pathway)
    : [];

  return (
    <div>
      {record.dc_language && (
        <Metadata name="Language" value={record.dc_language} />
      )}
      {record.individuals && (
        <Metadata name="Individuals" value={individuals} />
      )}
      {record.rights && <Metadata name="Rights" value={rights} />}
      {record.relation_types && (
        <Metadata name="Relations" value={record.relation_types} />
      )}
      {record.workflows && <Metadata name="Workflows" value={workflows} />}
      {record.pathways && <Metadata name="Pathways" value={pathways} />}
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
