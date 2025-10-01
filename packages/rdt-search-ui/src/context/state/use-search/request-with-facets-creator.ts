import type { SearchProps } from "../../../context/props";
import type { SearchState } from "../../../context/state";
import { FacetControllers } from "../../controllers";

import { ESRequest } from "./request-creator";

export class ESRequestWithFacets extends ESRequest {
  constructor(
    state: SearchState,
    props: SearchProps,
    controllers: FacetControllers,
  ) {
    super(state, props, controllers);

    if (state.facetStates == null) return;

    this.setAggregations();
    this.setQuery();
  }

  private setAggregations() {
    for (const facet of this.controllers.values()) {
      const facetState = this.state.facetStates.get(facet.ID);
      if (facetState == null) continue;

      const facetFilter = this.state.facetFilters.get(facet.ID);

      // const facetAggs = facet.createAggregation(
      //   this.payload.post_filter,
      //   facetFilter?.value,
      //   facetState,
      // );

      const facetAggs = this.createFacetAggregation(
        facet,
        this.payload.post_filter,
        facetFilter?.value,
        facetState,
      );

      if (facetAggs != null) {
        // clone to avoid mutating facetAggs directly
        const updatedFacetAggs = { ...facetAggs };
        const facetAgg = updatedFacetAggs[facet.ID];
        if (facetAgg && facet.config.secondaryId) {
          facetAgg.aggs = {
            ...facetAgg.aggs, // keep any existing sub-aggs
            original_value: {
              top_hits: {
                _source: { includes: [facet.config.secondaryId] },
                size: 1,
              },
            },
          };
        }

        this.payload.aggs = {
          ...this.payload.aggs,
          ...updatedFacetAggs,
        };

        // this.payload.aggs = {
        //   ...this.payload.aggs,
        //   ...facetAggs,
        // }
      }
    }
  }


  private createFacetAggregation(
    facet: any,
    postFilter: any,
    values: any,
    state: any,
  ) {
    // If facet has a labelField, build a terms agg + top_hits sub-agg
    if (facet.config.field && facet.config.labelField) {
      return {
        [facet.ID]: {
          filter: postFilter ?? { match_all: {} },
          aggs: {
            [facet.ID]: {
              terms: { field: facet.config.field },
              aggs: {
                label: {
                  top_hits: {
                    _source: [facet.config.labelField],
                    size: 1,
                  },
                },
              },
            },
          },
        },
      };
    }

    // Fallback: use original createAggregation if available
    return facet.createAggregation?.(postFilter, values, state) ?? null;
  }

  private setQuery() {
    if (!this.state.query.length) return;
    const query_string: { fields?: string[]; query: string } = {
      query: this.state.query,
    };

    if (this.props.fullTextFields) {
      query_string.fields = this.props.fullTextFields;
    }

    this.payload.query = { query_string };

    if (this.props.fullTextFields || this.props.fullTextHighlight) {
      const initialFields = this.props.fullTextFields || [];

      // Create default highlight fields from fullTextFields
      // ['title^2', 'description'] => { title: {}, description: {} }
      const fields = initialFields.reduce(
        (prev, curr) => {
          // Remove modifiers from the field name, ie title^2 => title
          const field = curr.split("^")[0];
          prev[field] = {};
          return prev;
        },
        {} as Record<string, {}>,
      );

      this.payload.highlight = {
        fields,
        require_field_match: false,
      };

      if (this.props.fullTextHighlight) {
        const { fields, ...rest } = this.props.fullTextHighlight;
        this.payload.highlight = {
          ...this.payload.highlight,
          fields: {
            ...this.payload.highlight.fields,
            ...fields,
          },
          ...rest,
        };
      }
    }
  }
}

export function addFilter(facetID: string, values: any, postFilter: any): any {
  const agg = {
    [facetID]: {
      aggs: { [facetID]: values },
      filter: { match_all: {} },
    },
  };

  if (postFilter != null) {
    // @ts-ignore
    agg[facetID].filter = postFilter;
  }

  return agg;
}
