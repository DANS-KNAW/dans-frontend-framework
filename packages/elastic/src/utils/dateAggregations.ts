import type { ESUIFacet } from "./configConverter";

/**
 * Add date_histogram aggregations in a global (unfiltered) bucket
 */
export function addDateAggregations(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  if (!externallyHandledFacets) return esRequest;

  Object.entries(externallyHandledFacets).forEach(([facetKey, facetConfig]) => {
    if (facetConfig.display !== "date") return;

    if (!esRequest.aggs) esRequest.aggs = {};
    
    // Filtered aggregation (respects other facets, excludes own filters)
    esRequest.aggs[`facet_bucket_${facetKey}`] = {
      filter: {
        bool: {
          must: []
        }
      },
      aggs: {
        [facetKey]: {
          date_histogram: {
            field: facetKey,
            calendar_interval: facetConfig.interval || "year",
            min_doc_count: 0,
            order: { _key: "asc" },
          },
        }
      }
    };

    // Global aggregation (shows all years always)
    esRequest.aggs[`${facetKey}_full`] = {
      global: {},
      aggs: {
        [facetKey]: {
          date_histogram: {
            field: facetKey,
            calendar_interval: facetConfig.interval || "year",
            min_doc_count: 0,
            order: { _key: "asc" },
            extended_bounds: {
              min: "1890-01-01",  // Adjust to your data range
              max: "2025-12-31"
            }
          },
        }
      }
    };
  });

  return esRequest;
}

export function fixDateRangeFilters(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  if (!esRequest.query?.bool?.filter) return esRequest;

  esRequest.query.bool.filter = esRequest.query.bool.filter.map((filterItem: any) => {
    if (filterItem.bool?.filter) {
      filterItem.bool.filter = filterItem.bool.filter.map((innerFilter: any) => {
        if (innerFilter.term) {
          const field = Object.keys(innerFilter.term)[0];
          const value = innerFilter.term[field];
          
          const isDateField = externallyHandledFacets?.[field]?.display === 'date';
          
          if (isDateField && typeof value === 'string') {
            const year = parseInt(value);
            const startOfYear = Date.UTC(year, 0, 1);
            const startOfNextYear = Date.UTC(year + 1, 0, 1);
            
            console.log(`Converting year ${year} to range:`, { startOfYear, startOfNextYear });
            
            return {
              range: {
                [field]: {
                  gte: startOfYear,
                  lt: startOfNextYear
                }
              }
            };
          }
        }
        return innerFilter;
      });
    }
    return filterItem;
  });

  return esRequest;
}

/**
 * Unified handler for date facets
 */
export function handleDateFacets(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>
) {
  let req = addDateAggregations(esRequest, externallyHandledFacets);
  req = fixDateRangeFilters(req, externallyHandledFacets);
  return req;
}