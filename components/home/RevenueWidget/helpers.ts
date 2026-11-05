import {
  Currency,
  PeriodCalculation,
  ProjectRevenuePeriod,
  ProjectRevenueWidget,
  RevenueWidgetCalculation,
} from 'types';

export const percentage = (
  amount?: number,
  total?: number,
  rateCard?: string,
  considerRateCard: boolean = true,
) => {
  if (total === 0) return 0;

  if (!total) total = 1;

  if (!amount) amount = 0;

  if (!considerRateCard) return Math.round((amount / total) * 100);

  return Math.round(rateCard ? (amount / total) * 100 : 100);
};

function percentageDiff(amount?: number, total?: number) {
  if (!amount) amount = 0;

  if (total === 0) return 0;

  if (!total) total = 1;

  const diff = ((amount - total) / Math.abs(total)) * 100;
  return Math.round(diff);
}

function hasOnlyZeroesAfterFirst(num: number) {
  const str = num.toString();

  const trimmed = str.replace(/^0+/, '');

  if (trimmed.length <= 1) return true;

  return trimmed
    .slice(1)
    .split('')
    .every((char) => char === '0');
}

export const maxChartValue = (chartValue: number[][]) => {
  const minRevenue = Math.max(...chartValue[0]);
  const minProfit = Math.max(...chartValue[1]);

  let maxValue = Math.max(minRevenue, minProfit);

  if (hasOnlyZeroesAfterFirst(maxValue)) {
    maxValue++;
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const roundedValue = Math.ceil(maxValue / magnitude) * magnitude;

  if (roundedValue < 10) return Math.ceil(roundedValue / 10) * 10;
  if (roundedValue < 100) return Math.ceil(roundedValue / 100) * 100;
  if (roundedValue < 1000) return Math.ceil(roundedValue / 100) * 100;
  if (roundedValue < 10000) return Math.ceil(roundedValue / 1000) * 1000;
  if (roundedValue < 100000) return Math.ceil(roundedValue / 10000) * 10000;
  if (roundedValue < 1000000) return Math.ceil(roundedValue / 100000) * 100000;
  if (roundedValue < 10000000) return Math.ceil(roundedValue / 1000000) * 1000000;
  if (roundedValue < 100000000) return Math.ceil(roundedValue / 10000000) * 10000000;
  if (roundedValue < 1000000000) return Math.ceil(roundedValue / 100000000) * 100000000;
  if (roundedValue < 10000000000) return Math.ceil(roundedValue / 1000000000) * 1000000000;

  return Math.ceil(roundedValue / 10000000000) * 10000000000;
};

export const formatNumberForChart = (number: number): string => {
  const isNegative = number < 0;
  const absNumber = Math.abs(number);

  let formattedNumber: string;

  if (absNumber >= 1_000_000_000) {
    formattedNumber = (absNumber / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absNumber >= 1_000_000) {
    formattedNumber = (absNumber / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absNumber >= 1_000) {
    formattedNumber = (absNumber / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    formattedNumber = absNumber.toString();
  }

  return isNegative ? `-${formattedNumber}` : formattedNumber;
};

export const getChartValue = (
  period: string,
  currency: Currency,
  chartType: string,
  revenue?: RevenueWidgetCalculation | ProjectRevenueWidget,
) => {
  if (!revenue) {
    return [[], []];
  }

  const isEBITDA = chartType?.split('/')?.[1] === 'EBITDA';

  let profitBar: number[] = [];
  let revenueBar: number[] = [];

  if ('adjusted_revenue' in revenue) {
    if (period === 'Monthly') {
      profitBar = revenue.monthly_calculations.map((item) =>
        isEBITDA ? item.net_profit[currency] : item.total_gross_margin[currency],
      );
      revenueBar = revenue.monthly_calculations.map((item) => item.adjusted_revenue[currency]);
    } else if (period === 'Yearly') {
      profitBar = revenue.yearly_calculations.map((item) =>
        isEBITDA ? item.net_profit[currency] : item.total_gross_margin[currency],
      );
      revenueBar = revenue.yearly_calculations.map((item) => item.adjusted_revenue[currency]);
    } else {
      profitBar = revenue.quarterly_calculations.map((item) =>
        isEBITDA ? item.net_profit[currency] : item.total_gross_margin[currency],
      );
      revenueBar = revenue.quarterly_calculations.map((item) => item.adjusted_revenue[currency]);
    }
  } else {
    if (period === 'Monthly') {
      profitBar = revenue.monthly_calculations.map((item) => item.profit);
      revenueBar = revenue.monthly_calculations.map((item) => item.revenue);
    } else if (period === 'Yearly') {
      profitBar = revenue.yearly_calculations.map((item) => item.profit);
      revenueBar = revenue.yearly_calculations.map((item) => item.revenue);
    } else {
      profitBar = revenue.quarterly_calculations.map((item) => item.profit);
      revenueBar = revenue.quarterly_calculations.map((item) => item.revenue);
    }
  }

  return [revenueBar, profitBar];
};

const getPreviousPeriodData = (
  calculations: (PeriodCalculation | ProjectRevenuePeriod)[],
  axisValue: string,
  isAdjustedRevenue: boolean,
  currency: Currency,
  isEBITDA: boolean,
) => {
  const prev = calculations.find((item) => item.label === axisValue);
  const prevIndex = calculations.indexOf(prev!);

  if (prevIndex === 0) return null;

  if (isAdjustedRevenue) {
    return (calculations[prevIndex - 1] as PeriodCalculation)[
      isEBITDA ? 'net_profit' : 'total_gross_margin'
    ][currency];
  } else {
    return (calculations[prevIndex - 1] as ProjectRevenuePeriod).profit;
  }
};

export const calculateProfitability = (
  bar: any,
  formValues: any,
  currency: Currency,
  chartType: string,
  revenue?: RevenueWidgetCalculation | ProjectRevenueWidget,
) => {
  if (!revenue) return 0;

  const isEBITDA = chartType?.split('/')?.[1] === 'EBITDA';

  const isAdjustedRevenue = 'adjusted_revenue' in revenue;
  const chartPeriod = formValues.revenue.chart_period;
  let previousData: number | null = null;

  if (chartPeriod === 'Monthly') {
    previousData = getPreviousPeriodData(
      revenue.monthly_calculations,
      bar.axisValue,
      isAdjustedRevenue,
      currency,
      isEBITDA,
    );
  } else if (chartPeriod === 'Yearly') {
    previousData = getPreviousPeriodData(
      revenue.yearly_calculations,
      bar.axisValue,
      isAdjustedRevenue,
      currency,
      isEBITDA,
    );
  } else if (chartPeriod === 'Quarterly') {
    previousData = getPreviousPeriodData(
      revenue.quarterly_calculations,
      bar.axisValue,
      isAdjustedRevenue,
      currency,
      isEBITDA,
    );
  }

  if (previousData === null) return 'hide';

  return percentageDiff(bar.data, previousData);
};
