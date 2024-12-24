import { Chip, Container } from "@mui/material";
import { getCurrentEndpoint, type Result } from "@dans-framework/rdt-search-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

interface SingleRecord {
  id: string;
  type: string;
  attributes: {
    doi: string;
    identifiers: any[];
    creators: {
      name: string;
      affiliation: string[];
      nameIdentifiers: any[];
    }[];
    titles: {
      title: string;
    }[];
    publisher: string;
    container: Record<string, any>;
    publicationYear: number;
    subjects: any[];
    contributors: {
      name: string;
      affiliation: string[];
      contributorType: string;
      nameIdentifiers: any[];
    }[];
    dates: {
      date: string | null;
      dateType: string;
    }[];
    language: string | null;
    types: {
      ris: string;
      bibtex: string;
      citeproc: string;
      schemaOrg: string;
      resourceTypeGeneral: string;
    };
    relatedIdentifiers: any[];
    relatedItems: any[];
    sizes: any[];
    formats: any[];
    version: string | null;
    rightsList: any[];
    descriptions: {
      description: string;
      descriptionType: string;
    }[];
    geoLocations: any[];
    fundingReferences: any[];
    url: string;
    contentUrl: string | null;
    metadataVersion: number;
    schemaVersion: string;
    source: string;
    isActive: boolean;
    state: string;
    reason: string | null;
    viewCount: number;
    downloadCount: number;
    referenceCount: number;
    citationCount: number;
    partCount: number;
    partOfCount: number;
    versionCount: number;
    versionOfCount: number;
    created: string;
    registered: string;
    published: string | null;
    updated: string;
  };
  relationships: {
    client: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  location_dev: {
    lat: string;
    lon: string;
  };
  location: string | null;
  publicationYear: number;
  prefix: string;
}

export function SingleRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState<SingleRecord | null>(null);
  const endpoint = getCurrentEndpoint();

  console.log(record)

  useEffect(() => {
    if (id) {
      fetch(`${endpoint}/_source/${encodeURIComponent(id)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
          }
          return res.json();
        })
        .then(setRecord)
        .catch((error) => {
          console.error("Failed to fetch record:", error);
          // You can also set an error state here to display an error message in the UI
          setRecord(null);  // Example: resetting the state in case of an error
        });
    }
  }, [id]);

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
          {record !== null ? 
          <Box>
            <Typography variant="h3">
              {record.attributes?.titles[0]?.title || <i>Untitled</i>}
            </Typography>

            <Typography gutterBottom>{record.attributes.descriptions[0]?.description || ""}</Typography>

            <Box mt={2}>
              <Metadata
                name="Created"
                value={new Date(record.attributes.registered).toDateString() ?? ["-"]}
                options={{ turnicate: false }}
              />
              <Metadata
                name="Updated"
                value={new Date(record.attributes.updated).toDateString() ?? ["-"]}
                options={{ turnicate: false }}
              />
              <Metadata
                name="Creators"
                value={record.attributes.creators?.map((i: any) => i.name) ?? ["-"]}
                options={{ turnicate: false }}
              />
              <Metadata
                name="Contributors"
                value={record.attributes.contributors?.map((i: any) => i.name) ?? ["-"]}
                options={{ turnicate: false }}
              />
              <Metadata
                name="Subjects"
                value={record.attributes.subjects?.map((i: any) => i.subject)}
                options={{ turnicate: false }}
              />

              {/* <MetadataList record={record} /> */}

              <Box sx={{ mt: 2, mb: 2 }}>
                {record.attributes.url && (
                  <Link href={record.attributes.url} target="_blank">
                    <Chip label="DOI" />
                  </Link>
                )}
              </Box>
              <ShowJSON record={record} />
            </Box>
          </Box> :
          <Box>
            <Typography variant="h3">
              Record not found
            </Typography>
            <Typography gutterBottom>Please go back and try again</Typography>
            </Box>
          }
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

export function MetadataList({ record }: { record: SingleRecord | Result }) {
  const contributors = record.attributes.contributors?.map((i: any) => i.name) || [];
  const creators = record.attributes.creators?.map((i: any) => i.name) || [];
  const subjects = record.attributes.subjects?.map((i: any) => i.subject) || [];

  return (
    <Box mt={2}>
      {creators.length > 0 &&
        <Metadata name="Creators" value={creators} />
      }
      {contributors.length > 0 && 
        <Metadata name="Contributors" value={contributors} />
      }
      {subjects.length > 0 && 
        <Metadata name="Subjects" value={subjects} />
      }
    </Box>
  );
}

function ShowJSON({ record }: { record: SingleRecord }) {
  const [active, setActive] = useState(false);

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
