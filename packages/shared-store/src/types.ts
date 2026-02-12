import { TypedUseSelectorHook } from 'react-redux';
import { ThunkAction, Action } from '@reduxjs/toolkit';

// Base types that will be extended by apps
export interface BaseRootState {}

export type BaseAppDispatch = any;

// Generic hook types that packages will use
export type AppSelector<State> = TypedUseSelectorHook<State>;
export type AppThunk<State, ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  Action<string>
>;
