'use client';

import { formatNumberForChart } from '../RevenueWidget/helpers';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { Props } from './types';
import { utilizationChartData } from './helpers';
import { formatDateForBack, toastGeneralError } from 'helpers';
import { getCookie } from 'cookies-next';
import { getUtilizationWidget } from 'services';

export const useUtilizationWidget = (
  utilization: Props['utilization'],
  setUtilization: Props['setUtilization'],
  departments: Props['departments'],
  dates: Props['dates'],
  setDates: Props['setDates'],
) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);
  const [utilizationLoading, setUtilizationLoading] = useState(false);
  const router = useRouter();

  const { getValues, watch } = useFormContext();

  const formValues = watch();

  const chartValue = utilizationChartData(
    formValues.utilization.chart_period,
    utilization,
    formValues.utilization.department_id,
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current) {
      import('echarts').then((echarts) => {
        if (chartRef.current) {
          const instance = echarts.init(chartRef.current);
          setChartInstance(instance);
        }
      });
    }

    if (chartInstance) {
      chartInstance.setOption({
        grid: {
          left: '28px',
          right: '2.5px',
          bottom: '32px',
          top: '28px',
        },
        tooltip: {
          trigger: 'axis',
          label: {
            show: false,
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#605BFF',
              width: 1,
              type: 'dotted',
            },
          },
          formatter: function (params: any) {
            const backgroundBar = params[0];
            const highlightBar = params[1];

            return `
              <div class="bg-white rounded-lg p-2 text-gray-800 text-xs">
                <div class="flex items-center mb-2">
                  <div class="w-4 h-4 mr-2 rounded-sm" style="background-color: #9DA1A9;"></div>
                  <span>${backgroundBar.seriesName} - ${backgroundBar.data.toLocaleString()}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 mr-2 rounded-sm" style="background-color: #4F46E5;"></div>
                  <span>${
                    highlightBar.seriesName
                  } - ${highlightBar.data.toLocaleString()} (${Math.round(
              backgroundBar.data === 0
                ? 0
                : Math.round((highlightBar.data / backgroundBar.data) * 100),
            )}%)</span>
                </div>
              </div>
            `;
          },
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data:
            formValues.utilization.chart_period === 1
              ? utilization?.months
              : formValues.utilization.chart_period === 3
              ? utilization?.years
              : utilization?.quarters,
          axisLabel: {
            color: '#80807B',
            interval: chartValue[0].length < 15 ? 0 : 'auto',
            fontSize: 10,
            margin: 15,
            rich: {
              customLabel: {
                padding: [0, 32, 0, 0],
                fontSize: 10,
              },
            },
            formatter: (value: string, index: number) => {
              const isLast = index === chartValue[0].length - 1;
              return isLast ? `{customLabel|${value}}` : value;
            },
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
            name: 'Billable',
            type: 'line',
            data: chartValue[0],
            smooth: true,
            showSymbol: chartValue[0].length === 1,
            lineStyle: {
              color: '#9DA1A9',
            },
          },
          {
            name: 'Utilized',
            type: 'line',
            data: chartValue[1],
            smooth: true,
            showSymbol: chartValue[1].length === 1,
            lineStyle: {
              color: '#4F46E5',
            },
            areaStyle: {
              color: 'rgba(79, 70, 229, 0.1)',
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
    formValues.utilization.chart_period,
    formValues.utilization.department_id,
    chartInstance,
    utilization,
    departments,
  ]);

  const dateChangedHandler = async (newDates: typeof dates = dates) => {
    setUtilizationLoading(true);
    try {
      setChartInstance(null);
      const utilizationWidget = await getUtilizationWidget(
        getCookie('token'),
        formatDateForBack(newDates.startDate),
        formatDateForBack(newDates.endDate),
        1,
      );

      setUtilization(utilizationWidget);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setUtilizationLoading(false);
    }
  };

  return {
    dateChangedHandler,
    dates,
    setDates,
    chartRef,
    router,
    getValues,
    utilizationLoading,
  };
};
