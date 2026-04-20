import type { ESUIFacet } from "./configConverter";

// Nested-mapped fields (ES mapping `nested`) can't be aggregated or filtered
// via a flat `terms` query. They need a `{nested: {path}}` wrapper around
// both the aggregation and any filter clauses. search-ui itself doesn't know
// how to do that.
//
// Strategy: nested facets live in BOTH `facets` (so search-ui renders them
// like any list facet) and `externallyHandledFacets` (registry for this
// connector). search-ui produces a normal `facet_bucket_<field>.aggs.<field>
// .terms` aggregation; we rewrite that single inner agg into a nested wrap.
// On response we unwrap the extra level so search-ui's bucket parser sees
// the expected `aggregations.facet_bucket_<field>.<field>.buckets` shape.

function nestedRegistry(
  externallyHandledFacets?: Record<string, ESUIFacet>,
): Map<string, string> {
  const out = new Map<string, string>();
  if (!externallyHandledFacets) return out;
  for (const [field, cfg] of Object.entries(externallyHandledFacets)) {
    if (cfg.type === "nested" && cfg.nestedPath) {
      out.set(field, cfg.nestedPath);
    }
  }
  return out;
}

// Replace the inner terms-agg with `{ nested: {path}, aggs: { [field]: terms } }`
// for every facet_bucket_<field> whose field is in the nested registry.
export function wrapNestedFacetAggregations(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  const nested = nestedRegistry(externallyHandledFacets);
  if (nested.size === 0 || !esRequest.aggs) return esRequest;

  for (const [field, path] of nested.entries()) {
    const bucketKey = `facet_bucket_${field}`;
    const bucket = esRequest.aggs[bucketKey];
    if (!bucket?.aggs?.[field]) continue;

    const innerTerms = bucket.aggs[field];
    bucket.aggs[field] = {
      nested: { path },
      aggs: {
        [field]: innerTerms,
      },
    };
  }

  return esRequest;
}

// Walk the compiled query and rewrite term/terms filters on nested fields
// into `{ nested: { path, query: { term: {...} } } }`. Search-ui builds
// filters under query.bool.filter[i].bool.filter[j] (post-filter style).
export function rewriteNestedFilters(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  const nested = nestedRegistry(externallyHandledFacets);
  if (nested.size === 0) return esRequest;

  const wrap = (clause: any): any => {
    if (clause.term) {
      const f = Object.keys(clause.term)[0];
      const path = nested.get(f);
      if (path) return { nested: { path, query: { term: clause.term } } };
    }
    return clause;
  };

  const walk = (node: any): any => {
    if (!node || typeof node !== "object") return node;
    if (Array.isArray(node)) return node.map(walk);
    if (node.bool) {
      for (const k of ["must", "should", "filter", "must_not"] as const) {
        if (Array.isArray(node.bool[k])) {
          node.bool[k] = node.bool[k].map(walk);
        }
      }
    }
    return wrap(node);
  };

  if (esRequest.query) esRequest.query = walk(esRequest.query);
  if (esRequest.post_filter) esRequest.post_filter = walk(esRequest.post_filter);
  if (esRequest.aggs) {
    for (const k of Object.keys(esRequest.aggs)) {
      const a = esRequest.aggs[k];
      if (a.filter) a.filter = walk(a.filter);
    }
  }

  return esRequest;
}

export function handleNestedFacets(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  let req = wrapNestedFacetAggregations(esRequest, externallyHandledFacets);
  req = rewriteNestedFilters(req, externallyHandledFacets);
  return req;
}

// After ES processes the wrapped agg, the bucket structure is
//   aggregations.facet_bucket_<field>.<field>.<field>.buckets
// search-ui expects
//   aggregations.facet_bucket_<field>.<field>.buckets
// so we collapse one level for each nested facet.
export function unwrapNestedAggregations(
  response: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  const nested = nestedRegistry(externallyHandledFacets);
  if (nested.size === 0) return;
  // search-ui's interceptor sees the raw ES response at the top level here;
  // older search-ui versions wrap it under .rawResponse. Check both.
  const aggs =
    response?.aggregations ??
    response?.rawResponse?.aggregations ??
    response?.body?.aggregations;
  if (!aggs) return;

  for (const field of nested.keys()) {
    const bucketKey = `facet_bucket_${field}`;
    const bucket = aggs[bucketKey];
    if (!bucket) continue;
    const wrapped = bucket[field];
    if (wrapped && wrapped[field]) {
      bucket[field] = wrapped[field];
    }
  }
}
