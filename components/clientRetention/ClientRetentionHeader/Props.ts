import { UseFormReturn } from 'react-hook-form';
import { ClientRetentionForm, ClientRetentionMetric, ClientRetentionTotals, Currency } from 'types';

export type Props = {
  totals: ClientRetentionTotals | undefined;
  currency: Currency;
  form: UseFormReturn<ClientRetentionForm>;
  loading: boolean;
  metric: ClientRetentionMetric;
};
