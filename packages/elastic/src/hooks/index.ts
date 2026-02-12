import { useLocation, matchPath } from "react-router-dom";

export function useRouteMatch(patterns: readonly (string | undefined)[]) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = pattern ? matchPath(pattern, pathname) : null;
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}