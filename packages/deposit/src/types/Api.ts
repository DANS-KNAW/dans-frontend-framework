import type { AutocompleteAPIFieldData, OptionsType } from "./MetadataFields";

export interface GorcResponse {
  id: string;
  parent_id?: string;
  title: string;
  description: string;
  parent_hierarchy?: string;
}

export interface RdaInterestGroupsResponse {
  id: string;
  title: string;
  url: string;
}

export interface RdaWorkGroupResponse {
  id: string;
  title: string;
  parent_id: string;
}

export interface RdaDomainsResponse {
  id: string;
  title: string;
  url: string;
}

export interface RdaPathwaysResponse {
  id: string;
  title: string;
  description: string;
}

interface License {
  domain_content: boolean;
  domain_data: boolean;
  domain_software: boolean;
  family: string;
  id: string;
  maintainer: string;
  od_conformance: string;
  osd_conformance: string;
  status: string;
  title: string;
  url: string;
  legacy_ids?: string[];
}

export interface LicenceResponse {
  number_of_results: number;
  items: License[];
}

interface SshLicense {
  id: string;
  name: string;
  shortDescription: string;
  uri: string;
  iconUrl: string;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export interface SshLicenceResponse {
  status: string;
  data: SshLicense[];
}

interface RorCountry {
  country_name: string;
  country_code: string;
}

interface RorItem {
  name: string;
  id: string;
  country: RorCountry;
}

export interface RorResponse {
  number_of_results: number;
  items: RorItem[];
}

interface OrcidItem {
  "family-names": string;
  "given-names": string;
  "orcid-id": string;
  "institution-name": string[];
}

export interface OrcidResponse {
  "num-found": number;
  "expanded-result": OrcidItem[];
}

interface GeonamesItem {
  name: string;
  fcodeName: string;
  countryName?: string;
  geonameId: string;
  lat: string;
  lng: string;
}

export interface GeonamesResponse {
  totalResultsCount: number;
  geonames: GeonamesItem[];
  ocean?: GeonamesItem;
}

export interface MaptilerCoordinateSystemResponse {
  results: {
    id: {
      authority: string;
      code: number;
    };
    name: string;
    transformations: number[] | null;
    bbox: number[];
  }[];
}

export interface MaptilerConversionResponse {
  results: {
    x: number;
    y: number;
  }[]
}

export interface ProxyResponse {
  status_code: number;
  text: string;
}

export interface GettyResponse {
  Vocabulary: GettyVocabulary;
}

export interface GettyVocabulary {
  Count: number;
  Subject: GettyItem[];
}

export interface GettyItem {
  Preferred_Term: string;
  Subject_ID: number;
}

export interface QueryReturnType<T = OptionsType[]> {
  data: AutocompleteAPIFieldData<T>;
  isLoading: boolean;
  isFetching: boolean;
}

export interface SheetsResponse {
  values: string[][];
}

export interface DatastationsItem {
  uri: string;
  prefLabel: string;
  lang: string;
  altLabel: string;
  localname: string;
}

export interface DatastationsResponse {
  results: DatastationsItem[];
}
