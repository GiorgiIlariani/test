import {
  ClientRetentionMetric,
  ClientRetentionViewMode,
  ClientRetentionWeightedAverages,
} from 'types';

export type Props = {
  labels: string[];
  weightedAverages: ClientRetentionWeightedAverages | undefined;
  metric: ClientRetentionMetric;
  loading: boolean;
  viewMode: ClientRetentionViewMode;
};
