import type { AutocompleteAPIFieldData, Datastations } from './Metadata';

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