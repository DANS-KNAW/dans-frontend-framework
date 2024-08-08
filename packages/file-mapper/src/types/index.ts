export type DarwinTerms = 
  | "term_localName"
  | "tdwgutility_organizedInClass"
  | "label";

export type DarwinOptions = {
  [key in DarwinTerms]: string;
}

export type MappingProps = {
  [key: string]: DarwinOptions;
}

export type Saves = {
  name: string;
  date: string;
  id: string;
}