import { useEffect, useRef, useState } from 'react';
import { ClientRetentionMetric, ClientRetentionWeightedAverages } from 'types';

export const useClientRetentionChartWidget = (
  labels: string[],
  weightedAverages: ClientRetentionWeightedAverages | undefined,
  metric: ClientRetentionMetric,
  loading: boolean,
) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current && !chartInstance && !loading) {
      import('echarts').then((echarts) => {
        if (chartRef.current) {
          const instance = echarts.init(chartRef.current);
          setChartInstance(instance);
        }
      });
    }

    if (chartInstance) {
      const metricValues = labels.map((label) => weightedAverages?.[metric][label] ?? 0);
      const revenueValues = labels.map((label) => weightedAverages?.revenue[label] ?? 0);
      const seriesData = [0, ...metricValues.slice(1)];

      const maxRevenue = Math.max(...revenueValues, 0);
      const roundedMaxRevenue = Math.ceil(maxRevenue / 25) * 25;

      chartInstance.setOption({
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: labels,
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: metric === 'revenue' ? roundedMaxRevenue : 100,
          interval: 25,
          axisLabel: { formatter: '{value}%' },
        },
        series: [
          {
            data: seriesData,
            type: 'line',
            lineStyle: {
              color: '#1e40af',
            },
            itemStyle: {
              color: '#1e40af',
            },
            areaStyle: {},
          },
        ],
      });
    }

    if (chartRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });

      resizeObserver.observe(chartRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [chartInstance, labels, weightedAverages, metric, loading]);

  return { chartRef };
};
