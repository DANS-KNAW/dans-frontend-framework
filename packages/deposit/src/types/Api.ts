import type { AutocompleteAPIFieldData, Datastations } from './MetadataFields';

interface GorcItem {
  id: string;
  parent_id?: string;
  title: string;
  description: string;
}

export interface GorcResponse {
  number_of_results: number;
  items: GorcItem[];
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
  'family-names': string;
  'given-names': string;
  'orcid-id': string;
  'institution-name': string[];
}

export interface OrcidResponse {
  'num-found': number;
  'expanded-result': OrcidItem[];
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

export interface QueryReturnType {
  data: AutocompleteAPIFieldData;
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