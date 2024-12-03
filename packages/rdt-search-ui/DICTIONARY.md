# RDT Search UI Dictionary

## FacetFilters

Map of user selected facet values. The key is the ID of the facet, the value is a [FacetFilterObject](src/common/types/search/facets.ts#L19). The FilterObject has a value of it's own and differs per facet. A ListFacet has a Set, a PieChart has a string.

## Query

Full text query. Equivalent to ES `query_string`. See [Query](src/context/state/index.ts#L36)

## SearchFilters

Combination of [FacetFilters](#facetfilters) and the full text [Query](#query). See [SearchFilters](src/views/header/active-filters/save-search/save-search.tsx#L10)
