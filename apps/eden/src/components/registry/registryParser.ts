import type { LinkSetDraft } from "../linkset-editor/linksetTypes";
import type { RegistryRepository, RegistryServiceSummary } from "./registryTypes";

export function parseRegistryRepositories(payload: unknown): RegistryRepository[] {
  return selectRepositoryRecords(payload)
    .map(mapRepositoryRecord)
    .filter((repository): repository is RegistryRepository => Boolean(repository));
}

export function parseRegistryServices(payload: unknown): RegistryServiceSummary[] {
  return selectServiceRecords(payload)
    .map(mapServiceRecord)
    .filter((service): service is RegistryServiceSummary => Boolean(service));
}

export function parseRegistryServicesToLinkSetDraft(
  services: RegistryServiceSummary[],
): LinkSetDraft {
  return {
    contexts: services.map((service) => ({
      // We want a  resolvable URL, so we prefer that, most likely it is the same as the uri anyway. 
      anchor: service.endpointUrl || service.uri,
      // We only have conformsTo, if it is present, we add a service-desc link relation.
      // This is far from optimal and the service API and the registry behind it should be improved
      ...(service.conformsTo
        ? {
            serviceDescLinkRelation: {
              id: "service-desc" as const,
              targets: [
                {
                  href: service.conformsTo,
                  type: "",
                  title: service.title ?? "",// title: "Conforms to",
                },
              ],
            },
          }
        : {}),
    })),
  };
}


function selectRepositoryRecords(payload: unknown): unknown[] {
  if (!isRecord(payload) || !Array.isArray(payload.repositories)) {
    return [];
  }

  return payload.repositories;
}

function mapRepositoryRecord(record: unknown): RegistryRepository | null {
  if (!isRecord(record)) {
    return null;
  }

  const url = typeof record.uri === "string" ? record.uri : "";
  const title = typeof record.title === "string" && record.title ? record.title : url;

  if (!title || !url) {
    return null;
  }

  return { title, url };
}

function selectServiceRecords(payload: unknown): unknown[] {
  if (!isRecord(payload)) {
    throw new Error("Invalid registry response: expected an object.");
  }

  if (!Array.isArray(payload.services)) {
    throw new Error("Invalid registry response: expected a `services` array.");
  }

  return payload.services;
}

function mapServiceRecord(record: unknown): RegistryServiceSummary | null {
  if (!isRecord(record) || typeof record.uri !== "string") {
    return null;
  }

  return {
    uri: record.uri,
    title: typeof record.title === "string" ? record.title : undefined,
    conformsTo: typeof record.conformsTo === "string" ? record.conformsTo : undefined,
    endpointUrl: typeof record.endpointUrl === "string" ? record.endpointUrl : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}