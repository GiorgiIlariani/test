import {
  ClientRetentionItem,
  ClientRetentionMetric,
  ClientRetentionTotals,
  ClientRetentionViewMode,
  ClientRetentionWeightedAverages,
  Currency,
} from 'types';

export type Props = {
  cohorts: ClientRetentionItem[] | undefined;
  weightedAverages: ClientRetentionWeightedAverages | undefined;
  totals: ClientRetentionTotals | undefined;
  currency: Currency;
  labels: string[];
  cols: number;
  colWidth?: string;
  loading: boolean;
  metric: ClientRetentionMetric;
  sortDirection?: 'asc' | 'desc';
  onCohortClick?: () => void;
  viewMode: ClientRetentionViewMode;
};
