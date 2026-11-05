import { Dispatch, SetStateAction } from 'react';

export type Props = {
  dates: {
    startDate: Date;
    endDate: Date;
  };
  setDates: Dispatch<
    SetStateAction<{
      startDate: Date;
      endDate: Date;
    }>
  >;
  dateChangedHandler: (newDates?: { startDate: Date; endDate: Date }) => void;
  dateFilterWrapperClassName?: string;
  thisYearClassName?: string;
  thisQuarterClassName?: string;
  thisMonthClassName?: string;
};
