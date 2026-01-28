import yearFormatter from "./yearFormatter";

// Types
type FacetType = "list" | "piechart" | "timerange" | "barchart" | "hidden" | "geomap";
type FacetWidth = "small" | "medium" | "large";
type SortDirection = "asc" | "desc";

interface LocalizedLabel {
  en: string;
  nl: string;
}

interface SearchField {
  field: string;
  weight?: number;
}

interface BaseFacet {
  field: string;
  label?: LocalizedLabel;
  disjunctive?: boolean;
  initialSize?: number;
  maxSize?: number;
  width?: FacetWidth;
}

interface HiddenFacet extends BaseFacet {
  type: "hidden";
}

interface ListFacet extends BaseFacet {
  type: "list" | "piechart";
}

interface GeoFacet extends BaseFacet {
  type: "geomap";
}

interface BarChartFacet extends BaseFacet {
  type: "barchart";
  orientation?: "horizontal" | "vertical";
  legend?: boolean;
}

interface TimeRangeFacet extends BaseFacet {
  type: "timerange";
  interval: "year" | "month" | "day";
  start: number | string;
  end: number | string;
}

type Facet = ListFacet | TimeRangeFacet | HiddenFacet | BarChartFacet | GeoFacet;

interface SortOption {
  field: string | null;
  label: string;
  direction?: SortDirection;
}

interface SearchResult {
  title: string;
  subTitle?: string;
  description: string;
  list?: { field: string; label: string }[];
}

export interface SimpleConfig {
  searchFields: SearchField[];
  facets: Facet[];
  sortOptions: SortOption[];
  searchResult: SearchResult;
}

// ES-UI Types
interface ESUISearchField {
  weight?: number;
}

interface ESUIResultField {
  raw?: {};
  snippet?: {
    size: number;
    fallback: boolean;
  };
}

export interface ESUIFacet {
  type: "value" | "range";
  label: LocalizedLabel;
  display: FacetType;
  size?: number;
  width?: FacetWidth;
  ranges?: Array<{ from: number | string; to?: number | string; name: string }>; // Allow string
  interval?: string;
  show?: number;
}

export interface ESUISortOption {
  name: string;
  value: Array<{ field: string; direction: SortDirection }> | [];
}

interface ESUIConfig {
  alwaysSearchOnInitialLoad: boolean;
  hasA11yNotifications: boolean;
  searchQuery: {
    filters: any[];
    search_fields: Record<string, ESUISearchField>;
    result_fields: Record<string, ESUIResultField>;
    disjunctiveFacets: string[];
    facets: Record<string, ESUIFacet>;
  };
  autocompleteQuery: {
    results: {
      fuzziness: boolean;
      resultsPerPage: number;
      result_fields: Record<string, ESUIResultField>;
    };
    suggestions: {
      types: {
        documents: {
          fields: string[];
        };
      };
      size: number;
    };
  };
  initialState?: any;
}

export interface ResultViewConfig {
  title: string;
  subTitle?: string;
  description: string;
  list?: { field: string; label: string }[];
}

interface ConvertedConfig {
  config: ESUIConfig;
  sortOptions: ESUISortOption[];
  resultsViewConfig?: ResultViewConfig;
}

// Converter function
export function convertToESUIConfig(simple: SimpleConfig): ConvertedConfig {
  const resultFields: Record<string, ESUIResultField> = {};
  const searchFields: Record<string, ESUISearchField> = {};
  
  // Convert search fields
  simple.searchFields.forEach(({ field, weight }) => {
    searchFields[field] = weight ? { weight } : {};
    resultFields[field] = {
      snippet: { size: 100, fallback: true }
    };
  });
  
  // Add facet fields to result fields
  simple.facets.forEach(({ field }) => {
    const baseField = field.replace(/\.keyword$/, '');
    if (!resultFields[baseField]) {
      resultFields[baseField] = { raw: {} };
    }
  });
  
  // Convert facets
  const facets: Record<string, ESUIFacet> = {};
  const disjunctiveFacets: string[] = [];
  const externallyHandledFacets: Record<string, ESUIFacet> = {};
  
  simple.facets.forEach(facet => {
    if (facet.disjunctive) {
      disjunctiveFacets.push(facet.field);
    }

    if (facet.type === "geomap") {
      externallyHandledFacets[facet.field] = {
        type: "geomap",
        label: facet.label || {en: '', nl: ''},
        display: "geomap",
        show: facet.initialSize,
        size: facet.maxSize || facet.initialSize,
      };
      return; // Skip geomap facets for ESUI config
    }
    
    if (facet.type === "timerange") {
      facets[facet.field] = {
        type: "range",
        ranges: yearFormatter(facet.start, facet.end),
        label: facet.label || {en: '', nl: ''},
        display: "timerange",
        interval: facet.interval,
        width: facet.width,
        show: facet.initialSize,
      };
    } else {
      const facetConfig: ESUIFacet = {
        type: "value",
        label: facet.label || {en: '', nl: ''},
        display: facet.type,
        size: facet.maxSize || facet.initialSize,
        show: facet.initialSize,
        ...(facet.type === "barchart"
        ? { 
            legend: facet.legend,
            orientation: facet.orientation,
          }
        : {}),
        ...(facet.width ? { width: facet.width } : {}),
      };
      
      facets[facet.field] = facetConfig;
    }
  });
  
  // Convert sort options
  const sortOptions: ESUISortOption[] = simple.sortOptions.map(opt => {
    if (!opt.field) {
      return { name: opt.label, value: [] };
    }
    return {
      name: opt.label,
      value: [{ field: opt.field, direction: opt.direction || "asc" }]
    };
  });

        
  console.log(externallyHandledFacets)
  
  return {
    config: {
      alwaysSearchOnInitialLoad: true,
      hasA11yNotifications: true,
      searchQuery: {
        filters: [],
        search_fields: searchFields,
        result_fields: resultFields,
        disjunctiveFacets,
        facets,
        externallyHandledFacets,
      },
      autocompleteQuery: {
        results: {
          fuzziness: true,
          resultsPerPage: 5,
          result_fields: {
            title: { snippet: { size: 100, fallback: true }},
          }
        },
        suggestions: {
          types: {
            documents: {
              fields: simple.searchFields.map(f => f.field)
            }
          },
          size: 4
        }
      },
    },
    sortOptions,
    resultsViewConfig: simple.searchResult,
  };
}