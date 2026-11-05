import { Currency, UnpublishedBudgets } from 'types';

export type Props = {
  isLoading: boolean;
  budgets?: UnpublishedBudgets | undefined;
  isWidgetLoading: boolean;
  className?: string;
  currency: Currency;
};
