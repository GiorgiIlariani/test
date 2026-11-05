import { formatNumber } from 'helpers';

export const getFormattedNumber = (
  formatter: Intl.NumberFormat,
  number: number,
  percentageValues: boolean | undefined,
  negativeValues: boolean | undefined,
) => {
  const safeNumber = isFinite(number) ? number : 0;
  let result = formatNumber(formatter, safeNumber);
  if (percentageValues) {
    result = `${result}%`;
  }
  if (negativeValues && number) {
    result = `-${result}`;
  }
  return result;
};
