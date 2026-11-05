import { Dispatch, SetStateAction } from 'react';
import { BenchStats, Currency } from 'types';

export type Props = {
  isLoading: boolean;
  rateCards: { id: number; title: string }[] | undefined;
  departments: { id: number; title: string }[] | undefined;
  benchStats: BenchStats | undefined;
  setBenchStats: Dispatch<SetStateAction<BenchStats | undefined>>;
  isTopWidget?: boolean;
  isWidgetLoading: boolean;
  currency: Currency;
  dates: { startDate: Date; endDate: Date };
  setDates: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
};
