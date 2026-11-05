'use client';

import { useEffect, useState } from 'react';
import { Props } from './types';

export const usePipelineFinancialControlTableCol = (props: Props) => {
  const [forecastValue, setForecastValue] = useState<number>();

  const handleSubmit = () => {
    if (props.data) props.submitTargetData?.({ ...props.data, ...{ target: forecastValue } });
  };

  const diffPositiveOrNegative = (num: number) => {
    if (!num) return '';
    if (num < 0) return 'bg-[#FEF2F2]';
    return 'bg-[#ECFDF5]';
  };

  const percent = () => {
    const delta = props.actual - props.forecast;
    const division = delta / props.forecast;
    if (!delta || !isFinite(division)) return 0;

    return parseFloat(`${division * 100}`).toFixed(2);
  };

  const loadLazy = <T,>(renderItem: T) =>
    props.isLoading ? (
      <div className='h-full mr-6 bg-gray-200 animate-pulse'>&nbsp;</div>
    ) : (
      renderItem
    );

  const { Q1, Q2, Q3, Q4 } = props.quarters;

  useEffect(() => {
    if (props.isCellEditable) setForecastValue(0);
  }, [Q1, Q2, Q3, Q4]);

  const forecastValueOrProps = forecastValue !== props.forecast ? props.forecast : forecastValue;

  return {
    forecastValue,
    handleSubmit,
    setForecastValue,
    diffPositiveOrNegative,
    forecastValueOrProps,
    percent,
    loadLazy,
  };
};
