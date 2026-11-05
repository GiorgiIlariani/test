'use client';

import { useEffect, useRef, useState } from 'react';
import { Props } from './types';

export const useProjectInvoiceBudgetWidget = (
  invoiceInfo: Props['invoiceInfo'],
  isWidgetLoading: boolean,
  projectIsLoading: boolean,
) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);

  const isLoading = projectIsLoading || isWidgetLoading;

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current && !chartInstance) {
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
            name: 'Invoices',
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
                value: invoiceInfo?.paid_amount,
                name: 'Paid',
                itemStyle: { color: '#4F46E5' },
              },
              {
                value: invoiceInfo?.not_invoiced,
                name: 'Not invoiced',
                itemStyle: { color: '#EFA51633' },
              },
              {
                value: invoiceInfo?.invoice_not_paid,
                name: 'Not paid',
                itemStyle: { color: '#EFA516' },
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
  }, [chartInstance, invoiceInfo, isLoading]);

  return { chartRef, isLoading };
};
