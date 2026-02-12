import { configureStore, type ThunkAction, type Action, type Reducer, type Middleware  } from "@reduxjs/toolkit";
import { errorLogger } from "@dans-framework/utils/error";

import type { StoreComponents } from "./DynamicStoreProvider";

interface FeatureConfig {
  module: () => Promise<FeatureModule>;
  exports: {
    reducer?: { value: string; key: string }[];
    api?: string[];
  };
}

interface FeatureModule {
  [key: string]: any;
}

const featureConfig: Record<StoreComponents, FeatureConfig> = {
  deposit: {
    module: () => import("@dans-framework/deposit"),
    exports: {
      reducer: [
        { value: "metadataReducer", key: "metadata" }, 
        { value: "filesReducer", key: "files" }, 
        { value: "submitReducer", key: "submit" }, 
        { value: "depositReducer", key: "deposit" }
      ],
      api: ["orcidApi", "rorApi", "licenceApi", "sshLicenceApi", "geonamesApi", "sheetsApi", "submitApi", "datastationsApi", "dansFormatsApi", "dansUtilityApi", "rdaApi", "languagesApi", "maptilerApi", "wmsApi", "biodiversityApi", "unsdgApi", "wikidataApi"]
    },
  },
  user: {
    module: () => import("@dans-framework/user-auth"),
    exports: {
      reducer: [{ value: "userReducer", key: "user" }],
      api: ["userApi", "validateKeyApi", "userSubmissionsApi"]
    },
  },
  fileMapper: {
    module: () => import("@dans-framework/file-mapper"),
    exports: {
      reducer: [{ value: "fileMapperReducer", key: "fileMapper" }],
      api: ["darwinCoreApi", "submitMappingApi"]
    },
  },
  repoAdvisor: {
    module: () => import("@dans-framework/repo-advisor"),
    exports: {
      reducer: [{ value: "repoAdvisorReducer", key: "repoAdvisor" }],
      api: ["repoAdvisorApi"]
    },
  },
  elastic: {
    module: () => import("@dans-framework/elastic"),
    exports: {
      reducer: [{ value: "elasticReducer", key: "elastic" }],
    }
  },
  elasticResult: {
    module: () => import("@dans-framework/elastic-result"),
    exports: {
      api: ["elasticResultApi"],
    }
  }
};

// Function to create store with only enabled features
export const createDynamicStore = async (items: StoreComponents[]) => {
  const reducers: Record<string, Reducer> = {
    // set default reducers here, always loaded
  };
  const middlewares: Middleware[] = [];

  // Load modules dynamically
  const loadPromises = items.map(async (key) => {
    const config = featureConfig[key];
    if (!config) return;

    // Dynamically import the module
    const module = await config.module();

    // Add the main reducer if specified
    if (config.exports.reducer) {
      config.exports.reducer.forEach(reducer => {
        reducers[reducer.key] = module[reducer.value];
      });
    }

    // Add API reducers and collect middleware
    if (config.exports.api) {
      config.exports.api.forEach(apiName => {
        const api = module[apiName];
        reducers[api.reducerPath] = api.reducer;
        middlewares.push(api.middleware);
      });
    }
  });

  // Wait for all modules to load
  await Promise.all(loadPromises);

  // Create store with dynamic configuration
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
      .concat(...middlewares)
      // add some always-on middlewares here
      .concat(errorLogger),
  });

  return store;
};

export type AppStore = Awaited<ReturnType<typeof createDynamicStore>>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
