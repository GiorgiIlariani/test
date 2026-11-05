import { Currency } from 'types';
import { HCPosition, MonthlyHCSortingState, QuarterlyHCSortingState } from 'types/HeadCount';

export type Props = {
  year: number;
  currency: Currency;
  loading: boolean;
  headCount: HCPosition[] | undefined;
  period: 'monthly' | 'quarterly';
  type: 'Headcount' | 'Cost';
  sortingState: {
    quarterly: QuarterlyHCSortingState;
    monthly: MonthlyHCSortingState;
  };
  sortHeadCountReport: (index: number) => void;
};
