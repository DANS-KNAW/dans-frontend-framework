import { registryApiConfig } from "./registryApiConfig";
import type { LinkSetDraft } from "../linkset-editor/linksetTypes";
import {
  parseRegistryRepositories,
  parseRegistryServices,
  parseRegistryServicesToLinkSetDraft,
} from "./registryParser";
import type { RegistryRepository, RegistryServiceSummary } from "./registryTypes";

export async function fetchRegistryRepositories(): Promise<RegistryRepository[]> {
  if (!registryApiConfig.repositoriesUrl) {
    throw new Error("Registry API endpoint is not configured.");
  }

  const payload = await fetchRegistryJson(registryApiConfig.repositoriesUrl);
  return parseRegistryRepositories(payload);
}

export async function fetchRegistryRepositoryServices(
  repository: RegistryRepository,
): Promise<RegistryServiceSummary[]> {
  const payload = await fetchRegistryJson(registryApiConfig.repositoryServicesUrl(repository));
  return parseRegistryServices(payload);
}

export async function fetchRegistryRepositoryLinkSetDraft(
  repository: RegistryRepository,
): Promise<LinkSetDraft> {
  const services = await fetchRegistryRepositoryServices(repository);
  return parseRegistryServicesToLinkSetDraft(services);
}

async function fetchRegistryJson(url: string): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(url, registryApiConfig.requestInit);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Browser request was blocked or failed. Ensure the registry API sends CORS headers for the Eden frontend origin.",
      );
    }

    throw error;
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!/\bapplication\/json\b|\+json\b/i.test(contentType)) {
    throw new Error(
      `Registry API returned ${contentType || "an unknown content type"} for ${url}. Check VITE_REGISTRY_API_BASE_URL.`,
    );
  }

  return response.json() as Promise<unknown>;
}