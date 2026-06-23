import type { ESUIFacet } from "./configConverter";

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

export function wrapNestedFacetAggregations(
  esRequest: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  const nested = nestedRegistry(externallyHandledFacets);
  if (nested.size === 0 || !esRequest.aggs) return esRequest;

  for (const bucket of facetBuckets(esRequest.aggs)) {
    for (const [field, path] of nested.entries()) {
      const innerTerms = bucket.aggs?.[field];
      if (!innerTerms || innerTerms.nested) continue;

      bucket.aggs[field] = {
        nested: { path },
        aggs: {
          [field]: innerTerms,
        },
      };
    }
  }

  return esRequest;
}

function facetBuckets(aggs: Record<string, any>): any[] {
  return Object.keys(aggs)
    .filter((k) => k.startsWith("facet_bucket"))
    .map((k) => aggs[k])
    .filter(Boolean);
}

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

export function unwrapNestedAggregations(
  response: any,
  externallyHandledFacets?: Record<string, ESUIFacet>,
) {
  const nested = nestedRegistry(externallyHandledFacets);
  if (nested.size === 0) return;
  const aggs =
    response?.aggregations ??
    response?.rawResponse?.aggregations ??
    response?.body?.aggregations;
  if (!aggs) return;

  for (const bucket of facetBuckets(aggs)) {
    for (const field of nested.keys()) {
      const wrapped = bucket[field];
      if (wrapped && wrapped[field]) {
        bucket[field] = wrapped[field];
      }
    }
  }
}
