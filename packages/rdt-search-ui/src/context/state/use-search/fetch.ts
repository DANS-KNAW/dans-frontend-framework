import type { Payload } from "./request-creator";
import { enqueueSnackbar } from "notistack";
import type { FixedFacetsProps } from "../../props";

const cache = new Map();

// Builds the query for fixed facets.
// Fixed facets are hard constraints (bool.filter: no scoring, AND semantics).
// The free-text query is a scoring clause (bool.must). Previously these were
// combined with bool.should + minimum_should_match:1, which let any text match
// satisfy the clause and silently bypassed fixed-facet restrictions entirely.
function addFixedFacetsToQuery(query: Payload, fixedFacets?: FixedFacetsProps[]) {
  const filters = fixedFacets?.map(({ type, location, value }) => {
    if (type === "keyword" || type === "client") {
      return {
        match: {
          [location]: value,
        },
      };
    } else if (type === "url") {
      return {
        wildcard: {
          [location]: {
            value: `*${value}*`,
          },
        },
      };
    }
    return null; // Ignore unsupported types
  });

  const fixedFilters = filters?.filter((filter) => filter !== null) ?? [];
  const textQuery = query.query;

  if (fixedFilters.length === 0 && !textQuery) return query;

  const bool: { filter?: any[]; must?: any[] } = {};
  if (fixedFilters.length > 0) bool.filter = fixedFilters;
  if (textQuery) bool.must = [textQuery];

  return {
    ...query,
    query: { bool },
  };
}

export async function fetchSearchResult(
  url: string,
  payload: Payload,
  dispatch: any,
  fixedFacets?: FixedFacetsProps[],
  user?: string,
  pass?: string,
) {
  let fetchResponse: Response;
  let response: any;

  const updatedQuery = addFixedFacetsToQuery(payload, fixedFacets);

  const body = JSON.stringify(updatedQuery);

  if (cache.has(body)) {
    return cache.get(body);
  }

  try {
    // set loading state and remove error
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    dispatch({
      type: "SET_ERROR",
      error: undefined,
    });
    fetchResponse = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // if user and pass are provided, add basic auth header
        ...(user && pass && {
          Authorization: `Basic ${btoa(`${user}:${pass}`)}`,
        }),
      },
      body: body,
    });
    response = await fetchResponse.json();
    cache.set(body, response);
  } catch (err) {
    console.log(err);
    enqueueSnackbar("Dashboard and Search error: failed to fetch data.", {
      variant: "error",
    });
    dispatch({
      type: "SET_ERROR",
      error: err,
    });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
    throw "Failed to fetch Faceted Search state";
  }

  dispatch({
    type: "SET_LOADING",
    loading: false,
  });

  return fetchResponse.status === 200 ? response : null;
}
