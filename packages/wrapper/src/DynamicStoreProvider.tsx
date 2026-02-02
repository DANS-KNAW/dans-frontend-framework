import { useState, useEffect, type FC, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createDynamicStore } from "./store";
import type { AppStore } from "./store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export type StoreComponents = 'deposit' | 'elastic' | 'user' | 'fileMapper' | 'repoAdvisor';

interface DynamicStoreProviderProps {
  storeComponents: StoreComponents[];
  children: ReactNode;
}

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <CircularProgress />
  </Box>
);

export const DynamicStoreProvider: FC<DynamicStoreProviderProps> = ({ 
  storeComponents, 
  children 
}) => {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    createDynamicStore(storeComponents).then(setStore);
  }, [storeComponents]);

  if (!store) {
    return <LoadingFallback />
  }

  return <ReduxProvider store={store}>{children}</ReduxProvider>
};