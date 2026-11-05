export const formatDate = (rawDate: string | Date, excludeDays?: boolean, shortYears?: boolean) => {
  const date = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;
  const day = date?.getDate().toString();
  const month = date?.getMonth() + 1;
  const year = !shortYears ? date?.getFullYear() : date?.getFullYear()?.toString()?.slice(-2);

  if (!rawDate) {
    return ' ';
  } else {
    return excludeDays
      ? `${month?.toString().length === 1 ? `0${month}` : month}.${year}`
      : `${day?.length === 1 ? `0${day}` : day}.${
          month?.toString().length === 1 ? `0${month}` : month
        }.${year}`;
  }
};

export const formatDateWithoutYear = (rawDate: string | Date) => {
  const date = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;
  const day = date?.getDate().toString();
  const month = date?.getMonth() + 1;

  return `${day?.length === 1 ? `0${day}` : day}.${
    month?.toString().length === 1 ? `0${month}` : month
  }`;
};

export const formatDateWithWeekDayNames = (date: string | Date) => {
  const formattedDate = new Date(date);
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', weekday: 'short' }).format(
    formattedDate,
  );
};

export const formatDateForBack = (rawDate: string | Date) => {
  const date = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;

  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
