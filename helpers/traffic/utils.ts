import { CurrentTab, FilterOptions } from 'types';

export const getDatesFromBackend = (backDates: {
  dates:
    | {
        startDate: string;
        endDate: string;
      }
    | undefined;
}) => {
  if (backDates?.dates) {
    return {
      endDate: new Date(backDates.dates.endDate),
      startDate: new Date(backDates.dates.startDate),
    };
  }
  const startDate = new Date();
  while (startDate.getDay() !== 5) {
    startDate.setDate(startDate.getDate() + 1);
  }
  return {
    endDate: new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0),
    startDate: startDate,
  };
};

export const compareOldFilteredInfo = (
  ref: {
    [key in CurrentTab]: {
      filter: FilterOptions[];
      date: number;
    };
  },
  filterOptions: FilterOptions[],
  newDatesCombined: number,
  page: CurrentTab,
) => {
  let isNew = false;
  isNew = Object.is(ref[page].filter, filterOptions);
  if (!isNew) {
    isNew = Object.is(ref[page].date, newDatesCombined);
  }

  return isNew;
};
