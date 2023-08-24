import type { SectionStatus} from './Metadata';

export interface StatusIconProps {
  status?: SectionStatus;
  title?: string;
  subtitle?: string;
  margin?: 'l' | 'r' | 'lr' | 'lt';
}
