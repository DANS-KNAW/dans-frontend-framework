import type { Payload } from "./request-creator";
import { enqueueSnackbar } from "notistack";

const cache = new Map();

// Builds the query for fixed facets
function addFixedFacetsToQuery(query, fixedFacets) {
  const filters = fixedFacets.map(({ type, location, value }) => {
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

  // Filter out nulls
  const validFilters = filters.filter((filter) => filter !== null);

  // Add the OR filter (should clause) to the existing query
  return {
    ...query,
    query: {
      bool: {
        should: validFilters,
        minimum_should_match: 1, // Ensure at least one filter matches
      },
    },
  };
}

export async function fetchSearchResult(
  url: string,
  payload: Payload,
  dispatch: any,
  fixedFacets: any,
) {
  let fetchResponse: Response;
  let response: any;

  const updatedQuery = addFixedFacetsToQuery(payload, fixedFacets);

  const body = JSON.stringify(updatedQuery);

  console.log(payload)

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
