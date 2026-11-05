import { defaultOrder } from 'helpers';
import { Quarter, HeaderCols, Quarters } from 'types';

export type Props = {
  toggleQuarter: (quarter: Quarter) => void;
  quarters: Quarters;
  headerCols: HeaderCols;
  sortRevenueTable: (
    sortBy: 'forecast' | 'actual' | 'delta',
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'total',
    month?: string | undefined,
  ) => void;
  order: typeof defaultOrder;
};
