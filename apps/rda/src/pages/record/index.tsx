import { getCurrentEndpoint, type Result } from "@dans-framework/rdt-search-ui";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface RdaRecord {
  card_url: string;
  dc_date: string;
  dc_description: string;
  dc_language: string;
  dc_type: string;
  subjects: {
    uuid_resource: string;
    resource: string;
    keyword: string;
  }[];
  individuals: {
    fullName: string;
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
  working_groups: {
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
  uri_type: {
    uuid_uri_type: string;
    uri_type: string;
    description: string;
    last_touch: string;
  }[];
  uuid: string;
  uuid_rda: string;
  uuid_resource: string;
  workflows: {
    UUID_Workflow: string;
    WorkflowState: string;
    Description: string;
    status: string;
  }[];
  fragment: string;
}

/**
 * This function takes the languages codes and makes it more readable.
 *
 * This should be handled in the dataset (Elastic Search) instead but
 * this will work temporary as a stop gap.
 *
 * This function can be removed once a property is implemented.
 *
 * @param code Language code
 */
function languageCodeToName(code: string): string {
  const languages: Record<string, string> = {
    eng: "English",
    fra: "French",
    deu: "German",
    spa: "Spanish",
    ita: "Italian",
    jpn: "Japanese",
    zho: "Chinese",
    rus: "Russian",
  };

  return languages[code] || code;
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
    <>
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="py-6">
            <h3 className="text-xl font-semibold leading-7 text-gray-900">
              {record.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-500">{`The goal of the Scholix initiative is to establish a high level interoperability framework for exchanging information about the links between scholarly literature and data. It aims to enable an open information ecosystem to understand systematically what data underpins literature and what literature references data. The DLI Service is the first exemplar aggregation and query service fed by the Scholix open information ecosystem. The Scholix framework together with the DLI aggregation are designed to enable other 3rd party services (domain-specific aggregations, integrations with other global services, discovery tools, impact assessments etc).`}</p>
            <p className="mt-4 text-sm leading-6 text-gray-500">{`Scholix is an evolving lightweight set of guidelines to increase interoperability. It consists of: (i) a consensus among a growing group of publishers, datacentres, and global/ domain service providers to work collaboratively and systematically to improve exchange of data-literature link information, (ii) an Information model: conceptual definition of what is a Scholix scholarly link, (iii) Link metadata schema: metadata representation of a Scholix link. Options for exchange protocols (forthcoming)`}</p>
            <p className="mt-4 text-sm leading-6 text-gray-500">{`Scholix is the "wholesaler to wholesaler" exchange framework, to be implemented by existing hubs or global aggregators of data-literature link information such as DataCite, CrossRef, OpenAIRE, or EMBL-EBI. These hubs in turn work with their natural communities of data centres or literature publishers to collect the information through existing community-specific workflows and standards. Scholix thus enables interoperability between a smaller number of large hubs and leverages the existing exchange arrangements between those hubs and their natural communities (eg between CrossRef and journal publishers).`}</p>
            <p className="mt-4 text-sm leading-6 text-gray-500">{`Scholix is a technical solution to wholesale information aggregation; it will need to be complemented by other policy, practice and cultural change advocacy initiatives. This approach could be extended over time to other types of research objects in and beyond research (e.g. software, tweets, etc).`}</p>
          </div>
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Date</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {record.dc_date}
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Language</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {languageCodeToName(record.dc_language)}
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Type</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {record.dc_type}
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Subjects</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.subjects.map((subject) => (
                      <li>{subject.keyword}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">URI Type</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.uri_type.map((uri_type) => (
                      <li>{uri_type.uri_type}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Workflows</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.workflows.map((workflow) => (
                      <li>{workflow.WorkflowState}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Rights</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.rights.map((right) => (
                      <li className="flex items-center">
                        <a
                          className="hover:text-[#4F8E31]"
                          href={right.lod_pid}
                        >
                          {right.description}
                        </a>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="mb-1 ml-2 size-4 text-[#4F8E31]"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  GORC Elements
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  GORC Attributes
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  Disciplines
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  Working Groups
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.working_groups.map((working_group) => (
                      <li className="flex items-center">
                        <a
                          className="hover:text-[#4F8E31]"
                          href={working_group.url}
                        >
                          {working_group.title}
                        </a>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="mb-1 ml-2 size-4 text-[#4F8E31]"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  Interest Groups
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  $120,000
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">Pathways</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  $120,000
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-900">
                  Individuals
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    {record.individuals.map((individual) => (
                      <li>{individual.fullName}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <ShowJSON record={record} />
      </div>
    </>
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

  console.log(record.individuals);

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
