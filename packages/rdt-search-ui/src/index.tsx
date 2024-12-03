import React, { Children, isValidElement } from "react";
import {
  SearchStateContext,
  SearchStateDispatchContext,
  intialSearchState,
} from "./context/state";
import { searchStateReducer } from "./context/state/reducer";
import App from "./app";
import { Dashboard } from "./dashboard";
import {
  SearchProps,
  SearchPropsContext,
  type ExternalSearchProps,
  defaultSearchProps,
  type EndpointProps,
} from "./context/props";
import {
  FacetControllersContext,
  type FacetControllers,
} from "./context/controllers";
import { useSearch } from "./context/state/use-search";
import type { FacetController } from "./facets/controller";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import { useTranslation } from "react-i18next";
import {
  serializeObject,
  deserializeObject,
} from "./views/active-filters/save-search/use-saved-searches";
import { EndpointSelector } from "./views/ui/endpoints";
import { useNavigate } from "react-router-dom";
import type { Result } from "./context/state/use-search/types";
import { motion, AnimatePresence } from "framer-motion";
import { FacetedSearchContext } from "./context/Provider";
import LZString from "lz-string";

export function FacetedSearch(props: ExternalSearchProps) {
  const [children, setChildren] = React.useState<React.ReactNode>(undefined);
  const [searchProps, setSearchProps] = React.useState<SearchProps | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Only set children once
    if (props.children == null || children != null) return;

    const _children =
      // Make sure it is an element and not a string, number, ...
      (
        isValidElement(props.children) &&
        // If children is a fragment, get the children of the fragment
        props.children.type.toString() ===
          Symbol.for("react.fragment").toString()
      ) ?
        props.children.props.children
      : props.children;

    setChildren(_children);
  }, [props.children, props.url]);

  // After children have been set, set the search props.
  // Everytime the props change, the search props will be updated
  React.useEffect(() => {
    if (children == null) return;

    // Extend the search props with default values
    const sp: SearchProps = {
      ...defaultSearchProps,
      ...props,
      url: `${props.url}/_search`,
      style: {
        ...defaultSearchProps.style,
        ...props.style,
      },
      shareRoutes: {
        dashboard: "/",
        results: "/search",
      },
    };

    Object.keys(sp.style).forEach((key) => {
      const value = (sp.style as any)[key];
      document.documentElement.style.setProperty(
        `--rdt-${camelCaseToKebabCase(key)}`,
        value,
      );
    });

    setSearchProps(sp);
  }, [props, children]);

  const controllers = useControllers(children);

  if (searchProps == null || controllers.size === 0) return;

  return (
    <SearchPropsContext.Provider value={searchProps}>
      <AppLoader searchProps={searchProps} controllers={controllers}>
        {children}
      </AppLoader>
    </SearchPropsContext.Provider>
  );
}

interface AppLoaderProps {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
}

function AppLoader({ children, controllers, searchProps }: AppLoaderProps) {
  // Check to see if there's a search query present in the url
  const queryParams = Object.fromEntries(
    new URLSearchParams(window.location.search).entries(),
  );
  const searchParams =
    queryParams.search &&
    LZString.decompressFromEncodedURIComponent(queryParams.search);
  // Get the state from session storage or search params if available. Search params has priority
  const storageState = deserializeObject(
    searchParams ||
      (sessionStorage.getItem(
        `rdt-search-state-${window.location.origin}-${searchProps.url}`,
      ) as string),
  );
  const [state, dispatch] = React.useReducer(
    searchStateReducer(controllers),
    // set storageState if available
    { ...intialSearchState, ...storageState },
  );

  useSearch({
    props: searchProps,
    state,
    dispatch,
    controllers,
  });

  const Component = searchProps.dashboard ? Dashboard : App;
  const { t } = useTranslation("app");

  React.useEffect(() => {
    if (!controllers.size) return;
    const facetStates = new Map();
    for (const [id, controller] of controllers.entries()) {
      facetStates.set(id, controller.initState());
    }

    dispatch({
      type: "SET_FACET_STATES",
      facetStates,
    });

    // clear uri search string
    const url = new URL(window.location.href);
    url.search = "";
    history.replaceState(null, "", url);
  }, [controllers]);

  React.useEffect(() => {
    // Save to session storage on state change, to retrieve when component is remounted
    sessionStorage.setItem(
      `rdt-search-state-${window.location.origin}-${searchProps.url}`,
      serializeObject({
        facetFilters: state.facetFilters,
        query: state.query,
      }),
    );
  }, [state.facetFilters, state.query]);

  return (
    <FacetControllersContext.Provider value={controllers}>
      <SearchStateDispatchContext.Provider value={dispatch}>
        <SearchStateContext.Provider value={state}>
          {state.loading && (
            <LinearProgress
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
              }}
            />
          )}
          {
            state.error ?
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ height: "20rem" }}
              >
                <Stack>
                  <Typography variant="h3">{t("error.header")}</Typography>
                  <Typography paragraph>
                    {t("error.p1", { message: state.error.message })}
                  </Typography>
                  <Typography paragraph>{t("error.p2")}</Typography>
                </Stack>
              </Stack>
              // no error, show components
            : <Component
                controllers={controllers}
                searchProps={searchProps}
                searchState={state}
              >
                {children}
              </Component>

          }
        </SearchStateContext.Provider>
      </SearchStateDispatchContext.Provider>
    </FacetControllersContext.Provider>
  );
}

/**
 * Initializes and returns a map of facet controllers based on the `children` prop.
 */
function useControllers(children: React.ReactNode): FacetControllers {
  const [controllers, setControllers] = React.useState<FacetControllers>(
    new Map(),
  );

  React.useEffect(() => {
    if (children == null || controllers.size > 0) return;

    // Initialise the facet controllers
    const facets = Children.map(
      children,
      (child: any) => new child.type.controller(child.props.config),
    );

    setControllers(
      new Map(facets.map((f: FacetController<any, any, any>) => [f.ID, f])),
    );
  }, [children, controllers]);

  return controllers;
}

/**
 * Converts a string from camelCase to kebab-case.
 * @example camelCaseToKebabCase('camelCase') => 'camel-case'
 */
function camelCaseToKebabCase(str: string) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/* Wrapper for the faceted search that makes multiple endpoint selection possible */
export const FacetedWrapper = ({
  dashboard,
  dashRoute,
  resultRoute,
}: {
  dashboard?: boolean;
  dashRoute?: string;
  resultRoute?: string;
}) => {
  const { config, endpoint } = React.useContext(FacetedSearchContext);
  const navigate = useNavigate();
  const currentConfig = config.find((e) => e.url === endpoint) as EndpointProps;

  return (
    <I18nextProvider i18n={i18nProvider}>
      <Container sx={{ pt: 4 }}>
        {config.length > 1 && (
          // show selector if there's more than 1 endpoint
          <EndpointSelector />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentConfig.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FacetedSearch
              dashboard={dashboard}
              fullTextFields={currentConfig.fullTextFields}
              fullTextHighlight={currentConfig.fullTextHighlight}
              onClickResult={(result: Result) =>
                navigate(`/${currentConfig.onClickResultPath}/${result.id}`)
              }
              ResultBodyComponent={currentConfig.resultBodyComponent}
              url={currentConfig.url}
              shareRoutes={{
                results: resultRoute,
                dashboard: dashRoute,
              }}
            >
              {currentConfig?.dashboard.map((node, i) =>
                React.cloneElement(node, { key: i }),
              )}
            </FacetedSearch>
          </motion.div>
        </AnimatePresence>
      </Container>
    </I18nextProvider>
  );
};
