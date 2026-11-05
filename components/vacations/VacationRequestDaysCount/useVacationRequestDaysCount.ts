'use client';

import { useWatch } from 'react-hook-form';
import { EmployeeModel, getWorkingDays } from 'helpers';

export const useVacationRequestDaysCount = (
  holidayDates: string[],
  currentEmployee: EmployeeModel,
) => {
  const [startDate, endDate, type] = useWatch({
    name: ['start_date', 'end_date', 'type'],
  });

  const workingDays = getWorkingDays(new Date(startDate), new Date(endDate), holidayDates);

  const isBonus = !currentEmployee.isBonusExpired() && currentEmployee.isBonusPeriod();

  const remainingDays = isBonus
    ? currentEmployee.numberOfBonusDaysLet()
    : currentEmployee.numberOfVacationDaysLeft();

  const overLimit = remainingDays - workingDays < 0;
  const overAmount = Math.abs(remainingDays - workingDays);
  const dayLabel = overAmount > 1 ? 'days' : 'day';

  return {
    startDate,
    endDate,
    type,
    workingDays,
    isBonus,
    remainingDays,
    overLimit,
    overAmount,
    dayLabel,
  };
};
