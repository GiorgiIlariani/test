import { Dispatch, SetStateAction } from 'react';
import { UtilizationWidget } from 'types';

export type Props = {
  isLoading: boolean;
  departments: { id: number; title: string }[] | undefined;
  utilization: UtilizationWidget | undefined;
  setUtilization: Dispatch<SetStateAction<UtilizationWidget | undefined>>;
  isWidgetLoading: boolean;
  dates: { startDate: Date; endDate: Date };
  setDates: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
};
