'use client';

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Props } from './types';
import { useFormContext } from 'react-hook-form';
import { formatDateForBack, toastGeneralError } from 'helpers';
import { getCookie } from 'cookies-next';
import { getBenchStats } from 'services';
import { percentage } from './helpers';

export const useBenchWidget = (
  benchStats: Props['benchStats'],
  setBenchStats: Props['setBenchStats'],
  rateCards: Props['rateCards'],
  dates: Props['dates'],
  setDates: Props['setDates'],
) => {
  const router = useRouter();
  const [benchLoading, setBenchLoading] = useState(false);

  const { getValues } = useFormContext();

  const dateChangedHandler = async (newDates: typeof dates = dates) => {
    setBenchLoading(true);
    try {
      setChartInstance(null);
      const benchWidget = await getBenchStats(
        getCookie('token'),
        formatDateForBack(newDates.startDate),
        formatDateForBack(newDates.endDate),
        1,
      );

      setBenchStats(benchWidget);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setBenchLoading(false);
    }
  };

  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);

  const departmentId = getValues('bench.department_id');
  const department = benchStats?.departments.find(
    (department) => departmentId === department.department_id,
  );
  const rateCard = rateCards?.find((card) => card.id === getValues('bench.rate_card_id'))?.title;

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
        series: [
          {
            name: 'Billable',
            tooltip: false,
            type: 'pie',
            radius: ['80%', '100%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              disabled: true,
            },
            data: [
              {
                value: departmentId
                  ? percentage(department?.scheduled, department?.capacity)
                  : percentage(benchStats?.scheduled, benchStats?.capacity),
                name: 'Utilized',
                itemStyle: { color: '#4F46E5' },
              },
              {
                value: departmentId
                  ? 100 - percentage(department?.scheduled, department?.capacity)
                  : 100 - percentage(benchStats?.scheduled, benchStats?.capacity),
                name: 'Bench',
                itemStyle: { color: '#EEF2FF' },
              },
            ],
          },
        ],
      });

      const resizeChart = () => {
        chartInstance.resize();
      };

      window.addEventListener('resize', resizeChart);

      return () => {
        window.removeEventListener('resize', resizeChart);
      };
    }
  }, [chartInstance, benchStats, departmentId, rateCards]);

  const sortedFilteredBenchEmployees = (
    departmentId ? department?.employees : benchStats?.employees
  )
    ?.filter((employee) => employee.bench && employee.bench > 0)
    ?.sort((a, b) => (percentage(a.bench, a.capacity) < percentage(b.bench, b.capacity) ? 1 : -1))
    ?.sort((a, b) => {
      if (a.archived_at === null) return -1;
      if (b.archived_at === null) return 1;
      return a.archived_at > b.archived_at ? 1 : -1;
    });

  return {
    dateChangedHandler,
    dates,
    setDates,
    chartRef,
    router,
    getValues,
    benchLoading,
    departmentId,
    rateCard,
    department,
    sortedFilteredBenchEmployees,
  };
};
