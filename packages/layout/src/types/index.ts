import type { LanguageStrings } from "@dans-framework/utils";

export interface Footer {
  top: FooterContent[];
  bottom: FooterContent[];
}

export interface FooterContent {
  header?: string | LanguageStrings;
  links?: Link[];
  freetext?: string | LanguageStrings;
  image?: {
    src: string;
    alt: string;
  };
  align?: "center" | "right";
  bottom?: boolean;
}

interface Link {
  name: string | LanguageStrings;
  link: string;
  icon?: string;
}
