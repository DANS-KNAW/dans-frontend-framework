import { createStoreHooks } from '@dans-framework/shared-store';
import type { RootState, AppDispatch } from './store';

// Create typed hooks for this specific app
export const { useAppDispatch, useAppSelector } = createStoreHooks<
  RootState,
  AppDispatch
>();