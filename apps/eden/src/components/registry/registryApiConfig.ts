import type { RegistryRepository } from "./registryTypes";

export type RegistryApiConfig = {
  repositoriesUrl: string;
  requestInit?: RequestInit;
  repositoryServicesUrl: (repository: RegistryRepository) => string;
};

export const registryApiConfig: RegistryApiConfig = {
  repositoriesUrl: "http://localhost:8000/repositories",

  // TODO: Add public request options if the API needs them, for example headers.
  requestInit: undefined,

  repositoryServicesUrl: (repository) =>
    `http://localhost:8000/repositories/${encodeURIComponent(repository.url)}/services`,
};