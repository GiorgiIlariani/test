export const toFixedWithoutZeros = (num: string, precision: number) => {
  if (typeof num === 'string' && num.endsWith('.')) {
    return num;
  }
  return `${1 * +(+num).toFixed(precision)}`;
};
