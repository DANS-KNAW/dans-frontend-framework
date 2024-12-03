import type { SearchHighlight } from "@elastic/elasticsearch/lib/api/types";

import React from "react";
import { ResultBodyProps, SortOrder } from "../state/use-search/types";

export interface StyleProps {
  // Set the background color of the active page number in the Pagination component
  buttonBackground?: string;

  // Set the general background color
  background?: string;

  // Set the spot color, used to attract attention to interactive elements
  spotColor?: string;
}

/**
 * Required SearchProps
 */
interface RequiredSearchProps {
  ResultBodyComponent: React.FC<ResultBodyProps>;
  url: string;
  children: React.ReactNode;
}

/**
 * Optional SearchProps with defaults
 */
interface OptionalWithDefaultsSearchProps {
  autoSuggest?: (query: string) => Promise<string[]>;
  excludeResultFields?: string[];
  onClickResult?: (
    result: any,
    ev: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  resultFields?: string[];
  resultBodyProps?: Record<string, any>;
  resultsPerPage?: number;
  track_total_hits?: number | boolean;
  sortOrder?: SortOrder;

  // TODO rename to theme? style is a React attribute
  //		or not necessary, because replacing with CSS?
  style?: StyleProps;
}

/**
 * Optional SearchProps without defaults (can be undefined)
 */
interface OptionalSearchProps {
  className?: string /* className prop is used by StyledComponents */;
  dashboard?: boolean;
  shareRoutes?: {
    results?: string;
    dashboard?: string;
  };

  // Fields to search full text. The field names are passed to
  // ElasticSearch so boosters can be applied to the fields.
  // ie: ['title^3', 'description^2', 'body']
  fullTextFields?: string[];

  // Set the ES highlight directly from the config,
  // gives more finegrained control over returned snippets
  fullTextHighlight?: SearchHighlight;

  SearchHomeComponent?: React.FC<any>;
}

// Endpoints for search/endpoint urls
export interface EndpointBaseProps {
  name: string;
  url: string;
}

export interface EndpointProps extends EndpointBaseProps {
  fullTextFields?: string[];
  fullTextHighlight?: SearchHighlight;
  onClickResultPath?: string;
  dashboard: React.ReactElement[];
  resultBodyComponent: React.FC<ResultBodyProps>;
}

/**
 * External props, added to component declaration
 */
export type ExternalSearchProps = RequiredSearchProps &
  OptionalWithDefaultsSearchProps &
  OptionalSearchProps;

/**
 * Internal props = external props + defaults
 */
export type SearchProps = Required<
  RequiredSearchProps & OptionalWithDefaultsSearchProps
> &
  OptionalSearchProps & {
    style: Required<StyleProps>;
  };

export const defaultSearchProps: SearchProps = {
  /**
   * These defaults will never be used, because these props are required and
   * therefor always overriden by the user props
   */
  children: null,
  ResultBodyComponent: () => null,
  url: "",

  autoSuggest: async function autoSuggest(query: string) {
    console.log("[RDT-SEARCH-UI] autoSuggest:", query);
    return [];
  },
  excludeResultFields: [],
  onClickResult: (result) => {
    console.log("[RDT-SEARCH-UI] onClickResult:", result);
  },
  resultBodyProps: {},
  resultFields: [],
  resultsPerPage: 20,
  sortOrder: new Map(),
  style: {
    background: "#FFFFFF",
    spotColor: "#0088CC",
    buttonBackground: "#F6F6F6",
  },
  track_total_hits: true,
};

export const SearchPropsContext =
  React.createContext<SearchProps>(defaultSearchProps);
