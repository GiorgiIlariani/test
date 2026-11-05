import { Dispatch, SetStateAction } from 'react';
import { Currency, ProjectRevenueWidget, RevenueWidgetCalculation } from 'types';

export type Props = {
  isLoading: boolean;
  rateCards?: { id: number; title: string }[] | undefined;
  revenue: RevenueWidgetCalculation | ProjectRevenueWidget | undefined;
  setRevenue:
    | Dispatch<SetStateAction<RevenueWidgetCalculation | undefined>>
    | Dispatch<SetStateAction<ProjectRevenueWidget | undefined>>;
  isWidgetLoading: boolean;
  hideFooter?: boolean;
  hideChartSelect?: boolean;
  hideRateCardSelect?: boolean;
  headerNames: {
    id: 'cost' | 'profit' | 'revenue' | 'capacity' | 'adjusted_revenue' | 'total_gross_margin';
    title: string;
  }[];
  callback: (from: string, to: string) => Promise<void>;
  hideRedirectLink?: boolean;
  dates: { startDate: Date; endDate: Date };
  setDates: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
  currency: Currency;
};
