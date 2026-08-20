import type { RegistryRepository } from "./registryTypes";

const REGISTRY_API_BASE_URL =
  import.meta.env.VITE_REGISTRY_API_BASE_URL?.trim() || "http://localhost:8000";

export type RegistryApiConfig = {
  repositoriesUrl: string;
  requestInit?: RequestInit;
  repositoryServicesUrl: (repository: RegistryRepository) => string;
};

export const registryApiConfig: RegistryApiConfig = {
  repositoriesUrl: `${REGISTRY_API_BASE_URL}/repositories`,

  // TODO: Add public request options if the API needs them, for example headers.
  requestInit: undefined,

  repositoryServicesUrl: (repository) =>
    `${REGISTRY_API_BASE_URL}/repositories/${encodeURIComponent(repository.url)}/services`,
};
