import { Props } from './Props';

export const useHeadCountHeader = (totals?: Props['totals'], isLoading?: boolean) => {
  const resources = totals?.resources ?? 0;
  const newHires = totals?.new_hires ?? 0;
  const terminationsTotal = totals?.terminations?.total ?? 0;
  const voluntaryTerminations = totals?.terminations?.voluntary ?? 0;
  const involuntaryTerminations = totals?.terminations?.involuntary ?? 0;
  const headcountStartYear = totals?.headcount?.start_year ?? 0;
  const headcountEndYear = totals?.headcount?.end_year ?? 0;

  const averageHeadcount = (headcountStartYear + headcountEndYear) / 2;
  const turnoverRate = averageHeadcount === 0 ? 0 : (terminationsTotal / averageHeadcount) * 100;
  const annualGrowth =
    headcountStartYear === 0
      ? 0
      : ((headcountEndYear - headcountStartYear) / headcountStartYear) * 100;

  const formattedTurnover = turnoverRate.toFixed(1);
  const formattedGrowth = `${annualGrowth > 0 ? '+' : ''}${annualGrowth.toFixed(1)}`;

  const renderValue = (value: number | string) =>
    isLoading ? <div className='h-6 w-16 bg-gray-200 rounded-sm animate-pulse' /> : value;

  return {
    resources,
    newHires,
    terminationsTotal,
    voluntaryTerminations,
    involuntaryTerminations,
    headcountStartYear,
    headcountEndYear,
    averageHeadcount,
    turnoverRate,
    annualGrowth,
    formattedTurnover,
    formattedGrowth,
    renderValue,
  };
};
