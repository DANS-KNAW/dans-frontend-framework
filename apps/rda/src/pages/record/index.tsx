import { getCurrentEndpoint, type Result } from "@dans-framework/rdt-search-ui";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import orcid from "../../config/images/orcid.png";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

interface Individual {
  fullName: string;
  identifier: string;
  identifier_type: string;
}

interface InterestGroup {
  title: string;
  description: string;
  url: string;
}

interface WorkingGroup {
  title: string;
  description: string;
  url: string;
}

interface GORCElement {
  uuid_element: string;
  element: string;
  description: string;
}

interface GORCAttribute {
  uuid_attribute: string;
  attribute: string;
  description: string;
}

interface Pathway {
  uuid_pathway: string;
  pathway: string;
  description: string;
  datasource: string;
  relation: string;
}

interface Discipline {
  "#": string;
  uuid: string;
  list_item: string;
  description: string;
  description_source: string;
  _taxonomy_parent: string;
  _taxonomy_terms: string;
  uuid_parent: string;
  url: string;
}

interface Right {
  lod_pid: string;
  description: string;
  type: string;
  status: string;
}

interface Workflow {
  UUID_Workflow: string;
  WorkflowState: string;
  status: string;
  Desciption: string;
}

interface RdaRecord {
  title: string;
  dc_description: string;
  source: string;
  fragment: string;
  dc_language: string;
  relation_types: string;

  pid_lod: string;
  pid_lod_type: string;
  uri: string;
  backupUri: string;
  uri2: string;
  backupUri2: string;

  rights?: Right[];
  individuals?: Individual[];
  interest_groups?: InterestGroup[];
  working_groups?: WorkingGroup[];
  gorc_elements?: GORCElement[];
  gorc_attributes?: GORCAttribute[];
  pathways?: Pathway[];
  disciplines?: Discipline[];
  workflows?: Workflow[];
}

const OrcidContributor = ({ person }: { person: Individual }) => (
  <Link
    href={`https://orcid.org/${person.identifier}`}
    target="_blank"
    rel="noopener"
    underline="hover"
    sx={{
      display: "flex",
      alignItems: "center",
      mr: 1.5,
      fontSize: "0.875rem",
      color: "#374151",
    }}
  >
    <Typography variant="body2" component="span" sx={{ color: "inherit" }}>
      {person.fullName}
    </Typography>
    <Box
      component="img"
      src={orcid}
      alt="ORCID"
      sx={{ width: 16, height: 16, ml: 0.5 }}
    />
  </Link>
);

const PlainContributor = ({ person }: { person: Individual }) => (
  <Typography
    variant="body2"
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      mr: 1.5,
      fontSize: "0.875rem",
      color: "#374151",
    }}
  >
    {person.fullName}
  </Typography>
);

const AccessUrls = ({
  uri,
  uri2,
}: {
  uri: string;
  backupUri: string;
  uri2: string;
  backupUri2: string;
}) => {
  const labelFor = (url: string) => {
    try {
      const host = new URL(url).host;
      if (host.includes("zenodo.org")) return "Zenodo";
      if (host.includes("rd-alliance.org")) return "RDA";
      return host;
    } catch {
      return url;
    }
  };

  // @TODO: This should be moved to the backend as CORS blocks the request.
  // useEffect(() => {
  //   const pairs = [
  //     [uri, backupUri],
  //     [uri2, backupUri2],
  //   ];

  //   Promise.all(
  //     pairs.map(async ([primary, backup]) => {
  //       try {
  //         const res = await fetch(primary, { method: "HEAD" });
  //         if (res.ok) return primary;
  //       } catch {}
  //       return backup;
  //     })
  //   ).then((resolvedUrls) => {
  //     setUris(resolvedUrls);
  //   });
  // }, [uri, backupUri, uri2, backupUri2]);

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {uri && (
        <Button
          variant="outlined"
          size="small"
          component="a"
          href={uri}
          target="_blank"
          rel="noopener"
        >
          {labelFor(uri)}
        </Button>
      )}

      {uri2 && (
        <Button
          variant="outlined"
          size="small"
          component="a"
          href={uri2}
          target="_blank"
          rel="noopener"
        >
          {labelFor(uri2)}
        </Button>
      )}
    </Stack>
  );
};

export function RdaRecord() {
  const { id } = useParams();
  const [record, setRecord] = React.useState<RdaRecord | null>(null);
  const endpoint = getCurrentEndpoint();

  const theme = useTheme();
  const { i18n } = useTranslation();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  React.useEffect(() => {
    fetch(`${endpoint}/_source/${id}`)
      .then((res) => res.json())
      .then(setRecord);
  }, [id]);

  if (record == null) return;

  const items = [
    {
      label: lookupLanguageString(
        { en: "Contributors", nl: "Bijdragers" },
        i18n.language
      ),
      value: record.individuals
        ? record.individuals.map((i) => (
            <React.Fragment key={i.identifier + i.fullName}>
              {i.identifier && i.identifier_type === "ORCID" ? (
                <OrcidContributor person={i} />
              ) : (
                <PlainContributor person={i} />
              )}
            </React.Fragment>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "Pathways", nl: "Paden" },
        i18n.language
      ),
      value: record.pathways
        ? record.pathways.map((p) => (
            <Typography
              key={p.uuid_pathway}
              variant="body2"
              sx={{ color: "#374151" }}
            >
              {p.pathway}
            </Typography>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "Interest Groups", nl: "Belangengroepen" },
        i18n.language
      ),
      value: record.interest_groups
        ? record.interest_groups.map((ig) => (
            <Typography key={ig.url} variant="body2" sx={{ color: "#374151" }}>
              {ig.title}
            </Typography>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "Working Groups", nl: "Werkgroepen" },
        i18n.language
      ),
      value: record.working_groups
        ? record.working_groups.map((wg) => (
            <Typography key={wg.url} variant="body2" sx={{ color: "#374151" }}>
              {wg.title}
            </Typography>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "GORC Elements", nl: "GORC elementen" },
        i18n.language
      ),
      value: record.gorc_elements
        ? record.gorc_elements.map((ge) => (
            <Typography
              key={ge.uuid_element}
              variant="body2"
              sx={{ color: "#374151" }}
            >
              {ge.element}
            </Typography>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "GORC Attributes", nl: "GORC attributen" },
        i18n.language
      ),
      value: record.gorc_attributes
        ? record.gorc_attributes.map((ga) => (
            <Typography
              key={ga.uuid_attribute}
              variant="body2"
              sx={{ color: "#374151" }}
            >
              {ga.attribute}
            </Typography>
          ))
        : [],
    },
    {
      label: lookupLanguageString(
        { en: "Domains", nl: "Domeinen" },
        i18n.language
      ),
      value: record.disciplines
        ? record.disciplines.map((d) => (
            <Typography key={d.uuid} variant="body2" sx={{ color: "#374151" }}>
              {d.list_item}
            </Typography>
          ))
        : [],
    },
    {
      label: "DOI",
      value:
        record.pid_lod_type === "DOI"
          ? [
              <Link
                href={record.pid_lod}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                variant="body2"
                sx={{ color: "#374151", display: "flex", alignItems: "top" }}
              >
                {record.pid_lod}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{
                    width: 16,
                    height: 16,
                    marginLeft: "0.25rem",
                    color: "#4F8E31",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>,
            ]
          : [],
    },
    {
      label: lookupLanguageString(
        { en: "Access URLs", nl: "Toegang URL's" },
        i18n.language
      ),
      value: [
        <AccessUrls
          key="access-urls"
          uri={record.uri}
          backupUri={record.backupUri}
          uri2={record.uri2}
          backupUri2={record.backupUri2}
        />,
      ],
    },
  ];

  return (
    <Container sx={{ mt: 6 }}>
      <Link
        href="/search"
        underline="none"
        sx={{ display: "flex", alignItems: "center", mb: 3 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: 16, height: 16, color: "#4F8E31" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        <Typography
          variant="body2"
          sx={{ color: "#4F8E31", fontWeight: 500, ml: 0.5 }}
        >
          {lookupLanguageString(
            { en: "Return to search", nl: "Terug naar zoeken" },
            i18n.language
          )}
        </Typography>
      </Link>
      <Typography
        variant="subtitle1"
        sx={{ color: "#111827", fontWeight: 600 }}
      >
        {record.title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#374151",
          mt: 3,
          lineHeight: 1.8,
        }}
      >
        {record.dc_description}
      </Typography>

      {record.source === "Annotation" && record.fragment && (
        <>
          <Typography variant="body2" color="#6b7280" sx={{ mt: 3, pt: 3 }}>
            Annotation Fragment
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#374151",
              mt: 3,
              pb: 5,
              lineHeight: 1.8,
            }}
          >
            {record.fragment}
          </Typography>
        </>
      )}

      <Typography variant="body2" color="#6b7280" sx={{ mt: 3 }}>
        {lookupLanguageString(
          {
            en: "Deposit metadata and status",
            nl: "Depositeren metadata en status",
          },
          i18n.language
        )}
      </Typography>

      <List disablePadding sx={{ mt: 3 }}>
        {items.map(({ label, value }) => (
          <ListItem
            key={label}
            disablePadding
            sx={{
              px: 0,
              py: 3,
              borderTop: "1px solid #d1d5db",
            }}
          >
            <Grid container={isSmUp} spacing={2}>
              <Grid item xs={12} sm={4} sx={{ mb: isSmUp ? 0 : 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#111827", fontWeight: 500 }}
                >
                  {label}
                </Typography>
              </Grid>
              <Grid item container direction="row" xs={12} sm={8}>
                {value.length > 0 ? (
                  value
                ) : (
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    -
                  </Typography>
                )}
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
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
