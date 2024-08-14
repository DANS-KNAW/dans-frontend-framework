export type DarwinTerms = 
  | "term_localName"
  | "tdwgutility_organizedInClass"
  | "label"
  | "header"
  | "term_deprecated";

export type DarwinOptions = {
  [key in DarwinTerms]: string;
}

export type MappingProps = {
  [key: string]: DarwinOptions;
}

export type Mapping = {
  [key: string]: string;
}

export type Saves = {
  name: string;
  date: string;
  id: string;
}

export type SerializedFile = {
  name: string;
  size: number;
  url: string;
}