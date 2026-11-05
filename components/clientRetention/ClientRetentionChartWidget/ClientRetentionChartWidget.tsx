import React from 'react';
import { Props } from './Props';
import { twMerge } from 'tailwind-merge';
import { useClientRetentionChartWidget } from './useClientRetentionChartWidget';

const ClientRetentionChartWidget: React.FC<Props> = ({
  labels,
  weightedAverages,
  metric,
  loading,
  viewMode,
}) => {
  const { chartRef } = useClientRetentionChartWidget(labels, weightedAverages, metric, loading);

  return (
    <div
      className={twMerge(
        'h-100 shrink-0 transition-all overflow-hidden duration-300',
        viewMode === 'table' ? 'h-0 pointer-events-none' : '',
        viewMode === 'chart' ? 'grow' : '',
      )}
    >
      <div ref={chartRef} className='border rounded-sm' style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ClientRetentionChartWidget;
