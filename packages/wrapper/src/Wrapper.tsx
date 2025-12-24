import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { StoreHooksProvider } from '@dans-framework/shared-store';

export default function Wrappper({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <StoreHooksProvider hooks={{ useAppDispatch, useAppSelector }}>
        {children}
      </StoreHooksProvider>
    </ReduxProvider>
  );
}