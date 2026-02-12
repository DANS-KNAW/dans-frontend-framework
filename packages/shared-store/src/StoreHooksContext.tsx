import { createContext, useContext, ReactNode } from 'react';

interface StoreHooks<State = any, Dispatch = any> {
  useAppDispatch: () => Dispatch;
  useAppSelector: <Selected>(selector: (state: State) => Selected) => Selected;
}

const StoreHooksContext = createContext<StoreHooks | null>(null);

export function StoreHooksProvider<State, Dispatch>({ 
  hooks, 
  children 
}: { 
  hooks: StoreHooks<State, Dispatch>; 
  children: ReactNode;
}) {
  return (
    <StoreHooksContext.Provider value={hooks}>
      {children}
    </StoreHooksContext.Provider>
  );
}

/**
 * Packages use this hook to access store hooks
 * This allows packages to be store-agnostic
 */
export function useStoreHooks<State = any, Dispatch = any>(): StoreHooks<State, Dispatch> {
  const context = useContext(StoreHooksContext);
  if (!context) {
    throw new Error('useStoreHooks must be used within StoreHooksProvider');
  }
  return context;
}