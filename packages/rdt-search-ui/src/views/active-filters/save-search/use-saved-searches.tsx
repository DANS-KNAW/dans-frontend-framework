import React from "react";
import { SearchFilters } from "./save-search";

export interface SavedSearch extends SearchFilters {
  name: string | undefined;
  hash: string;
  date: string; // UTC string
}

export function useSavedSearches(
  url: string,
): [SavedSearch[], (ss: SavedSearch) => void] {
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([]);

  const saveSearch = React.useCallback(
    (savedSearch: SavedSearch) => {
      const nextSavedSearches = [...savedSearches];
      nextSavedSearches.unshift(savedSearch);
      localStorage.setItem(
        getStorageKey(url),
        serializeObject(nextSavedSearches),
      );
      setSavedSearches(nextSavedSearches);
    },
    [url, savedSearches],
  );

  React.useEffect(() => {
    const _savedSearches = localStorage.getItem(getStorageKey(url));
    if (_savedSearches == null) return;
    setSavedSearches(deserializeObject(_savedSearches));
  }, [url]);

  return [savedSearches, saveSearch];
}

export function getStorageKey(url: string) {
  return `rdt-search__ss__${url}`;
}

function replacer(_key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: [...value],
    };
  }

  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: [...value],
    };
  }

  return value;
}

function reviver(_key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }

    if (value.dataType === "Set") {
      return new Set(value.value);
    }
  }

  return value;
}

export function serializeObject(object: any) {
  return JSON.stringify(object, replacer);
}

export function deserializeObject(filters: string) {
  return JSON.parse(filters, reviver);
}
