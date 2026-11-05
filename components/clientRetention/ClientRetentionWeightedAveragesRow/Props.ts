import {
  ClientRetentionMetric,
  ClientRetentionTotals,
  ClientRetentionWeightedAverages,
  Currency,
} from 'types';

export type Props = {
  weightedAverages: ClientRetentionWeightedAverages | undefined;
  totals: ClientRetentionTotals | undefined;
  metric: ClientRetentionMetric;
  currency: Currency;
  cols: number;
  colWidth?: string;
};
