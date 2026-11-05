export const isProjectNearEnd = (termDate: string, isCompleted?: boolean) => {
  const formattedDate = new Date(termDate).valueOf();
  const today = new Date().valueOf();
  const oneDay = 24 * 60 * 60 * 1000;

  const daysLeft = Math.round((formattedDate - today) / oneDay);

  if (isCompleted) {
    return daysLeft > 0 ? (daysLeft <= 7 ? 1 : daysLeft <= 28 ? 0 : null) : null;
  } else {
    return daysLeft <= 7 ? 1 : daysLeft <= 28 ? 0 : null;
  }
};

export const formatEmployeeHours = (input?: number | string): string | number => {
  const value = Number(input);

  if (isNaN(value)) return 0;

  const parts = value.toString().split('.');
  const decimalPart = parts[1];

  if (decimalPart && decimalPart.length > 2) {
    return parseFloat(value.toFixed(2));
  }

  return value;
};
