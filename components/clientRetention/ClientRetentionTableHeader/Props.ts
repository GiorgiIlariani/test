import { ClientRetentionMetric } from 'types';

export type Props = {
  labels: readonly string[];
  colWidth?: string;
  metric: ClientRetentionMetric;
  sortDirection?: 'asc' | 'desc';
  onCohortClick?: () => void;
};
