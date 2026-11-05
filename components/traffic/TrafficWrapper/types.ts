import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Currency,
  EmployeeProfitabilityStatisticsType,
  SetState,
  TrafficStatisticsType,
} from 'types';

export type Props = {
  currentPage: 'people' | 'projects' | 'timeoffs';
  setCurrentPage: SetState<'people' | 'projects' | 'timeoffs'>;
  navigateTabs: (currentTab: 'people' | 'projects' | 'timeoffs') => void;
  dates: {
    startDate: Date;
    endDate: Date;
  };
  setDates: SetState<Props['dates']>;
  dateChangedHandler: (newDates?: Props['dates']) => void;
  statisticsHeader: TrafficStatisticsType | EmployeeProfitabilityStatisticsType;
  statisticsIsLoading: boolean;
  getCSVHandler: () => void;
  children: ReactNode;
  scvButtonIsLoading: boolean;
  isBooked: boolean;
  changeBookedHandler: (booked: boolean, actual: boolean, nonActive: boolean) => void;
  showNav?: boolean;
  headerTitles: {
    title: string;
    field: string;
    percentageField?: string;
  }[];
  swapLastAndPreviousWidget?: boolean;
  title: string;
  form?: UseFormReturn<
    {
      rate_card_id: number;
    },
    any,
    undefined
  >;
  rateCards?: { id: number; title: string }[] | undefined;
  showCSVDownload?: boolean;
  isProfitability?: boolean;
  currency?: Currency;
};
