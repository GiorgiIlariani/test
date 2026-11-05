import { UseFormReturn } from 'react-hook-form';
import { Currency, EmployeeProfitabilityStatisticsType, TrafficStatisticsType } from 'types';

export type Props = {
  statisticsHeader: TrafficStatisticsType | EmployeeProfitabilityStatisticsType;
  statisticsIsLoading: boolean;
  headerTitles: {
    title: string;
    field: string;
    percentageField?: string;
  }[];
  swapLastAndPreviousWidget?: boolean;
  form?: UseFormReturn<
    {
      rate_card_id: number;
    },
    any,
    undefined
  >;
  rateCards?: { id: number; title: string }[] | undefined;
  isProfitability?: boolean;
  currency?: Currency;
};
