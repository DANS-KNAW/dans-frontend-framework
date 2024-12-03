import type { BaseFacetConfig } from "../context/state/facets";

export function isConfig(
  props: { config: BaseFacetConfig } | any,
): props is { config: BaseFacetConfig } {
  return props.hasOwnProperty("config");
}
