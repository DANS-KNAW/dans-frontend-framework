export type DarwinTerms =
  | "term_localName"
  | "tdwgutility_organizedInClass"
  | "label"
  | "header"
  | "term_deprecated";

export type DarwinOptions = {
  [key in DarwinTerms]: string;
};

export interface Mapping {
  [key: string]: DarwinOptions;
}

export interface Saves {
  name: string;
  date: string;
  id: string;
}

export interface SerializedFile {
  name: string;
  size: number;
  url: string;
}

export type FileError = "tooManyRows";

export interface SheetData {
  [key: string]: string;
}
