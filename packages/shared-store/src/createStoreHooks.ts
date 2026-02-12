import { useDispatch, useSelector } from 'react-redux';
import type { AppSelector } from './types';
import type { Dispatch } from '@reduxjs/toolkit';

/**
 * Factory to create typed hooks for a specific store configuration
 * Apps call this and pass the hooks to packages via context
 */
export function createStoreHooks<RootState, AppDispatch extends Dispatch>() {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: AppSelector<RootState> = useSelector;

  return {
    useAppDispatch,
    useAppSelector,
  };
}