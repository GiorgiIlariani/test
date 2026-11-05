'use client';

import { formatDate } from 'helpers';
import { getNewEndDate } from './helpers';
import { Props } from './types';

export const useDateFilter = (
  addOrEditDateFilter: Props['addOrEditDateFilter'],
  entireSelectedField: Props['entireSelectedField'],
  filterOptions: Props['filterOptions'],
  addingInsideSelectedFilter: Props['addingInsideSelectedFilter'],
) => {
  const startDate = addingInsideSelectedFilter?.meta?.startDate ?? null;
  const endDate = addingInsideSelectedFilter?.meta?.endDate ?? null;

  const filtersOfSameKind = filterOptions.filter((el) => el.type === entireSelectedField?.value);

  const handleDateChange = (date: Date | null, isEndDate?: boolean) => {
    if (date) {
      const newStartDate = isEndDate ? (startDate ? startDate : date) : date;
      const newEndDate = getNewEndDate(date, isEndDate, endDate, newStartDate);
      date.setHours(0, 0, 0, 0);
      addOrEditDateFilter({
        childConditions: [],
        ConditionIsAnd: true,
        isChild: false,
        id: addingInsideSelectedFilter?.id ?? filtersOfSameKind.length + 1,
        isIsNot: true,
        shouldDefaultToAndInInsideCondition: false,
        type: entireSelectedField?.value ?? '',
        value: `from ${formatDate(newStartDate)} to ${formatDate(newEndDate)}`,
        meta: {
          endDate: newEndDate,
          startDate: newStartDate,
        },
        filter_type: entireSelectedField?.filter_type ?? '',
      });
    }
  };

  return {
    startDate,
    endDate,
    handleDateChange,
  };
};
