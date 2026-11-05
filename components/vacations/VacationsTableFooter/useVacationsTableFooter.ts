'use client';

import { useMemo } from 'react';
import { Props } from './types';

export const useVacationsTableFooter = (props: Props) => {
  const sumOfVacationsByMonth = useMemo(() => {
    const totalVacationsByMonth = Array.from({ length: 12 }, () => ({
      vacation: 0,
      sick_leave: 0,
    }));

    for (let i = 0, j; i < props.vacations.length; ) {
      const { vacations } = props.vacations[i];

      if (vacations.length === 0) {
        i++;
        continue;
      }

      if (j == null) j = vacations.length;
      const { number_of_vacation_days_in_month, type, status } = vacations[j - 1];

      for (let key in number_of_vacation_days_in_month) {
        const [year, mKey] = key?.split('-').map(Number);

        if (status !== 'approved' || year !== props.currentYear) continue;

        switch (type) {
          case 'vacation':
            totalVacationsByMonth[mKey - 1].vacation += number_of_vacation_days_in_month[key];
            break;
          case 'sick leave':
            totalVacationsByMonth[mKey - 1].sick_leave += number_of_vacation_days_in_month[key];
          default:
            break;
        }
      }
      if (j === 1) {
        i++;
        j = null;
      } else j--;
    }

    return totalVacationsByMonth;
  }, [props.vacations, props.currentYear]);

  return { sumOfVacationsByMonth };
};
