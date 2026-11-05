export const defaultValue = {
  id: null,
  name: '',
  department_id: null,
  department: '',
  1: { price: null, id: null },
  2: { price: null, id: null },
  3: { price: null, id: null },
  4: { price: null, id: null },
  5: { price: null, id: null },
  6: { price: null, id: null },
  7: { price: null, id: null },
  8: { price: null, id: null },
  9: { price: null, id: null },
  10: { price: null, id: null },
  11: { price: null, id: null },
  12: { price: null, id: null },
  13: { price: 0, id: null },
};
export const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export const convertNumber = (number: number, rate: number, divide: boolean) => {
  if (divide) {
    return number / rate;
  }
  return number * rate;
};

export const convertNumberFromUnrelatedCurrencies = (
  number: number,
  oldRate: number,
  newRate: number,
  divide: boolean,
) => {
  if (divide) {
    return number / (newRate / oldRate);
  }
  return number * (newRate / oldRate);
};
