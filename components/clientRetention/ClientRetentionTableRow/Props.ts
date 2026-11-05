import { ClientRetentionItem, ClientRetentionMetric, Currency } from 'types';

export type Props = {
  cohort: ClientRetentionItem;
  currency: Currency;
  cols: number;
  colWidth?: string;
  metric: ClientRetentionMetric;
};
