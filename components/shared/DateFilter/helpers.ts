export const formatWeekDay = (weekDay: string) => weekDay[0];

export const getNewEndDate = (
  newDate: Date,
  isEndDate: boolean | undefined,
  endDate: Date | null,
  startDate: Date,
) => {
  if (isEndDate) {
    return newDate;
  } else if (endDate) {
    if (startDate > endDate) {
      return startDate;
    } else {
      return endDate;
    }
  } else {
    return newDate;
  }
};
