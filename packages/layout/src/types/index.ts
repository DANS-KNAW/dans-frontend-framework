import type { LanguageStrings } from "@dans-framework/utils";

export interface Footer {
  top: FooterContent[];
  bottom: FooterContent[];
}

export interface FooterContent {
  header?: string | LanguageStrings;
  links?: (Link | Button)[];
  freetext?: string | LanguageStrings;
  image?: {
    src: string;
    alt: string;
    width?: number;
  };
  align?: "center" | "right";
  bottom?: boolean;
}

interface Link {
  name: string | LanguageStrings;
  link: string;
  icon?: string;
}

interface Button {
  name: string | LanguageStrings;
  onClick: () => void;
  icon?: string;
}
