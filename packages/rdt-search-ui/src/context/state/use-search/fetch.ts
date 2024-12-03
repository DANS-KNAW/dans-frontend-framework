import type { Payload } from "./request-creator";
import { enqueueSnackbar } from "notistack";

const cache = new Map();

export async function fetchSearchResult(
  url: string,
  payload: Payload,
  dispatch: any,
) {
  let fetchResponse: Response;
  let response: any;

  const body = JSON.stringify(payload);

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
      body: JSON.stringify(payload),
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
