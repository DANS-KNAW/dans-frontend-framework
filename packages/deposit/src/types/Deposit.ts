import type { ReactNode, SyntheticEvent } from 'react';

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface TabHeaderProps {
  handleChange: (event: SyntheticEvent, newValue: number) => void;
  value: number;
}