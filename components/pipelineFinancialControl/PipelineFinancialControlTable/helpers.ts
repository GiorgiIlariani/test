import { PIPELINE_DUMMY_DATA, QUARTERS } from 'config';
import {
  Delta,
  ProjectRawData,
  Quarters,
  Month,
  Quarter,
  MoneyInAllCurrency,
  Currency,
} from 'types';

export function* generateArrayFromQuarterStates(quarterStates: [Quarter, boolean][]): Generator<{
  key: Quarter;
  month: Month | '';
  n: number | null;
}> {
  for (let i = 0; i < quarterStates.length; i++) {
    let [key, isOpen] = quarterStates[i];
    if (isOpen) {
      for (let j = 0; j <= 2; j++) {
        yield { key, month: QUARTERS[i].months[j], n: +key[1] * 3 - 3 + j };
      }
      continue;
    }

    yield { key, month: '', n: null };
  }
}

export const getColumnCount = <T extends Quarters>(col: T) => ({
  gridTemplateColumns: `12rem ${col.Q1 ? 3 : 1}fr ${col.Q2 ? 3 : 1}fr ${col.Q3 ? 3 : 1}fr ${
    col.Q4 ? 3 : 1
  }fr 1fr`,
});

export const getTotalSums = (
  month: number,
  key: 'forecast' | 'actual',
  keyTotal: '' | '_total',
  tableRawData: ProjectRawData[],
  sampleObject: MoneyInAllCurrency,
  allCurrencies: Currency[],
) => {
  let sum = sampleObject;
  allCurrencies.forEach((currencySymbol) => {
    for (let i = 2; i >= 0; i--) {
      sum[currencySymbol] +=
        tableRawData[month - i]?.pipeline[`${key}${keyTotal}`]?.[currencySymbol] || 0;
    }
  });
  return sum;
};

export const getTotalDeltaSums = (
  month: number,
  tableRawData: ProjectRawData[],
  sampleObject: MoneyInAllCurrency,
  allCurrencies: Currency[],
) => {
  let deltaSum: Delta = {
    other: {
      other: structuredClone(sampleObject),
      sick_leave: structuredClone(sampleObject),
      vacation: structuredClone(sampleObject),
    },
    percentage: 0,
    total: structuredClone(sampleObject),
  };

  allCurrencies.forEach((currencySymbol) => {
    for (let i = 2; i >= 0; i--) {
      deltaSum.other.other[currencySymbol] +=
        tableRawData[month - i]?.pipeline.delta.other.other[currencySymbol];
      deltaSum.other.sick_leave[currencySymbol] +=
        tableRawData[month - i]?.pipeline.delta.other.sick_leave[currencySymbol];
      deltaSum.other.vacation[currencySymbol] +=
        tableRawData[month - i]?.pipeline.delta.other.vacation[currencySymbol];
      deltaSum.total[currencySymbol] +=
        tableRawData[month - i]?.pipeline.delta.total[currencySymbol];
    }
  });

  return deltaSum;
};

const getDummyData = () => {
  const item = PIPELINE_DUMMY_DATA;

  const data = [];
  for (let i = 0; i < 12; i++) {
    item.month.push(item.month[0]);
    if (i < 4) item.quarter.push(item.quarter[0]);
  }
  for (let i = 0; i < 10; i++) data.push(item);
  return data;
};

export const dummyData = getDummyData();
