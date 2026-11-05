import { Currency, SalaryPaymentType } from 'types';

export const calculateSalaryChange = (
  salary: number | undefined | string,
  oldSalary: number | undefined,
  currency: Currency,
  currencyRates: {
    [key: string]: number;
  },
  oldCurrency: Currency,
  paymentType: SalaryPaymentType | undefined,
  oldPaymentType: SalaryPaymentType | undefined,
  defaultCurrency: Currency,
) => {
  if (
    typeof salary === 'undefined' ||
    !oldSalary ||
    salary === '' ||
    paymentType !== oldPaymentType
  ) {
    return null;
  }

  const newCurrencyRate = currencyRates[currency];
  const oldCurrencyRate = currencyRates[oldCurrency];
  const convertedNewSalary =
    defaultCurrency === 'GEL'
      ? Number(+salary / newCurrencyRate) ?? 1
      : Number(+salary * newCurrencyRate) ?? 1;
  const convertedOldSalary =
    defaultCurrency === 'GEL'
      ? Number(+oldSalary / oldCurrencyRate) ?? 1
      : Number(+oldSalary * oldCurrencyRate) ?? 1;
  const result = (+convertedNewSalary / convertedOldSalary) * 100 - 100;

  if (!result && result !== 0) {
    return null;
  }

  if (result === 0) {
    return {
      percentage: result,
      formattedValue: `${result.toFixed(2)}%`,
      type: 'neutral' as const,
    };
  } else if (+convertedNewSalary >= convertedOldSalary) {
    return {
      percentage: result,
      formattedValue: `+${result.toFixed(2)}%`,
      type: 'increase' as const,
    };
  } else {
    return {
      percentage: result,
      formattedValue: `${result.toFixed(2)}%`,
      type: 'decrease' as const,
    };
  }
};
