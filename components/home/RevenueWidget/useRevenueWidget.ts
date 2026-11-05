'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  convertNumbersAsPrice,
  formatDateForBack,
  getCurrencySymbol,
  toastGeneralError,
} from 'helpers';
import {
  calculateProfitability,
  formatNumberForChart,
  getChartValue,
  maxChartValue,
  percentage,
} from './helpers';
import { Props } from './types';
import { Currency } from 'types';

export const useRevenueWidget = (
  revenue: Props['revenue'],
  rateCards: Props['rateCards'],
  isLoading: boolean,
  isWidgetLoading: boolean,
  fetchRevenueCallBack: Props['callback'],
  dates: Props['dates'],
  setDates: Props['setDates'],
  currency: Currency,
) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const router = useRouter();

  const { getValues, watch } = useFormContext();

  const formValues = watch();

  const chartValue = getChartValue(
    formValues.revenue.chart_period,
    currency,
    formValues.revenue.chart_type,
    revenue,
  );

  const loading = isLoading || isWidgetLoading;

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current && !loading) {
      import('echarts').then((echarts) => {
        // Dom element could unmount during import
        if (chartRef.current) {
          const instance = echarts.init(chartRef.current);
          setChartInstance(instance);
        }
      });
    }

    if (chartInstance) {
      chartInstance.setOption({
        animation: true,
        animationDuration: 2000,
        animationDelay: 0,
        grid: {
          left: '24px',
          right: '24px',
          bottom: chartValue[1].length > 12 ? '10%' : '3%',
          top: '7%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove',
          axisPointer: {
            type: 'none',
          },
          formatter: function (params: any) {
            const backgroundBar = params[0];
            const highlightBar = params[1];

            const profitability = calculateProfitability(
              highlightBar,
              formValues,
              currency,
              formValues.revenue.chart_type,
              revenue,
            );

            const isNegative = typeof profitability === 'number' && profitability < 0;

            const isZero = typeof profitability === 'number' && profitability === 0;

            return `
              <div class="bg-white rounded-lg p-2 text-gray-800 text-xs">
              <div class="justify-between items-center mb-4 ${
                typeof profitability === 'number' ? 'flex' : 'hidden'
              }">
              <h2 class="uppercase text-2xs">profitability</h2>
              <p class="p-1 ${isZero && 'text-gray-800!'} ${isZero && 'bg-white!'} ${
              !isNegative ? 'text-[#059669]' : 'text-red-600'
            }  ${
              !isNegative ? 'bg-[#05966940]' : 'bg-red-200'
            } text-2xs rounded-[35px] flex gap-1 items-center">
              <span class="${isNegative && 'rotate-180'} ${isZero && 'hidden!'}">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 8.5L8.5 3.5" stroke="${
                !isNegative ? '#059669' : '#dc2626'
              }" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.5 3.5H8.5V8.5" stroke="${
                !isNegative ? '#059669' : '#dc2626'
              }" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
               </span>
               ${isNegative || isZero ? '' : '+'}${profitability}%</p>
              </div>
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 mr-2 rounded-sm" style="background-color: #4F46E5;"></div>
                  <span>${highlightBar.seriesName} - ${getCurrencySymbol(
              currency,
            )}${convertNumbersAsPrice(backgroundBar.data)}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 mr-2 rounded-sm" style="background-color: #DFE2E7;"></div>
                  <span>${backgroundBar.seriesName} -  ${getCurrencySymbol(
              currency,
            )}${convertNumbersAsPrice(highlightBar.data)} (${
              backgroundBar.data === 0
                ? 0
                : Math.round((highlightBar.data / backgroundBar.data) * 100)
            }%)</span>
                </div>
              </div>
            `;
          },
        },

        xAxis: {
          type: 'category',
          data:
            formValues.revenue.chart_period === 'Monthly'
              ? revenue?.months
              : formValues.revenue.chart_period === 'Yearly'
              ? revenue?.years
              : revenue?.quarters,
          axisLabel: {
            color: '#80807B',
            fontSize: 10,
            margin: 15,
          },
          axisLine: {
            lineStyle: {
              color: '#F1F2F4',
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          max: maxChartValue(chartValue),
          axisLabel: {
            formatter: function (value: number) {
              return value === 0 ? '' : formatNumberForChart(value);
            },
            color: '#80807B',
            fontSize: 10,
          },
          axisLine: {
            lineStyle: {
              color: '#F1F2F4',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#F1F2F4',
            },
          },
        },
        series: [
          {
            name: formValues.revenue.chart_type?.split('/')?.[1],
            type: 'bar',
            barWidth: '12px',
            barGap: '35%',
            itemStyle: {
              color: '#4F46E5',
              borderRadius: [10, 10, 10, 10],
            },
            emphasis: {
              itemStyle: {
                opacity: 0.5,
              },
            },
            data: chartValue[0],
          },
          {
            name: formValues.revenue.chart_type?.split('/')?.[0],
            type: 'bar',
            barWidth: '12px',
            barGap: '35%',
            itemStyle: {
              color: '#DFE2E7',
              borderRadius: [10, 10, 10, 10],
            },
            data: chartValue[1],
          },
        ],
        dataZoom: [
          {
            show: chartValue[1].length > 12,
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: (12 / chartValue[1].length) * 100,
            height: 10,
            bottom: 5,
            textStyle: {
              color: 'transparent',
            },
          },
        ],
        media: [
          {
            option: {
              tooltip: { triggerOn: 'mousemove' },
            },
          },
          {
            query: { maxWidth: 600 },
            option: {
              tooltip: { triggerOn: 'click' },
            },
          },
        ],
      });
    }

    const resizeChart = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', resizeChart);
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, [
    formValues.revenue.chart_type,
    formValues.revenue.chart_period,
    revenue,
    chartInstance,
    rateCards,
    loading,
    currency,
  ]);

  const rateCard = rateCards?.find((card) => card.id === formValues.revenue.rate_card_id)?.title;

  const dateChangedHandler = async (newDates: typeof dates = dates) => {
    setRevenueLoading(true);
    try {
      setChartInstance(null);
      await fetchRevenueCallBack(
        formatDateForBack(newDates.startDate),
        formatDateForBack(newDates.endDate),
      );
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setRevenueLoading(false);
    }
  };

  const getHeaderPrices = (
    headerId:
      | 'cost'
      | 'profit'
      | 'revenue'
      | 'capacity'
      | 'adjusted_revenue'
      | 'total_gross_margin',
  ) => {
    if (revenue && 'adjusted_revenue' in revenue) {
      if (headerId === 'capacity') {
        return convertNumbersAsPrice(
          rateCard
            ? revenue.capacity?.[rateCard]!?.[currency]
            : revenue.adjusted_revenue?.[currency] ?? 0,
        );
      } else {
        return convertNumbersAsPrice(
          revenue[headerId as 'adjusted_revenue' | 'total_gross_margin']?.[currency] ?? 0,
        );
      }
    } else if (revenue && 'cost' in revenue) {
      return convertNumbersAsPrice(revenue[headerId as 'cost' | 'profit' | 'revenue'] ?? 0);
    }

    return convertNumbersAsPrice(0);
  };

  const getHeaderPercents = (
    headerId:
      | 'cost'
      | 'profit'
      | 'revenue'
      | 'capacity'
      | 'adjusted_revenue'
      | 'total_gross_margin',
  ) => {
    if (revenue && 'adjusted_revenue' in revenue) {
      return percentage(
        revenue?.[headerId as 'adjusted_revenue' | 'total_gross_margin'][currency],
        headerId === 'adjusted_revenue' && rateCard
          ? revenue?.capacity?.[rateCard][currency]
          : revenue?.adjusted_revenue[currency],
        rateCard,
      );
    } else if (revenue && 'cost' in revenue) {
      return percentage(
        revenue?.[headerId as 'cost' | 'profit'],
        revenue?.revenue,
        rateCard,
        false,
      );
    }

    return convertNumbersAsPrice(0);
  };

  return {
    rateCard,
    dateChangedHandler,
    dates,
    setDates,
    chartRef,
    revenueLoading,
    setRevenueLoading,
    router,
    getValues,
    getHeaderPrices,
    getHeaderPercents,
  };
};
