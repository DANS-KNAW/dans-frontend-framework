import type { ReactNode } from "react";
// import { Provider as ReduxProvider } from "react-redux";
// import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { StoreHooksProvider } from '@dans-framework/shared-store';
import { DynamicStoreProvider, type StoreComponents } from "./DynamicStoreProvider";

export default function Wrapper({ children, storeComponents }: { children: ReactNode, storeComponents: StoreComponents[] }) {
  return (
    <DynamicStoreProvider storeComponents={storeComponents}>
      <StoreHooksProvider hooks={{ useAppDispatch, useAppSelector }}>
        {children}
      </StoreHooksProvider>
    </DynamicStoreProvider>
  );
}