import React from 'react';
import { Props } from './Props';
import {
  ClientRetentionTableHeader,
  ClientRetentionTableRow,
  ClientRetentionTableSkeleton,
  ClientRetentionWeightedAveragesRow,
} from 'components';
import { twMerge } from 'tailwind-merge';

const ClientRetentionTable: React.FC<Props> = ({
  cohorts,
  weightedAverages,
  totals,
  currency,
  labels,
  cols,
  colWidth = '10rem',
  loading,
  metric,
  sortDirection,
  onCohortClick,
  viewMode,
}) => {
  return (
    <div
      className={twMerge(
        'h-100 shrink-0 transition-all overflow-hidden rounded-md duration-300 pb-8',
        viewMode === 'chart' ? 'h-0 pointer-events-none pb-0' : '',
        viewMode === 'table' ? 'max-h-max h-full' : '',
      )}
    >
      <div className='overflow-auto max-h-full border'>
        <ClientRetentionTableHeader
          labels={labels}
          colWidth={colWidth}
          metric={metric}
          sortDirection={sortDirection}
          onCohortClick={onCohortClick}
        />

        {loading ? (
          <ClientRetentionTableSkeleton colWidth={colWidth} />
        ) : (
          <>
            <ClientRetentionWeightedAveragesRow
              weightedAverages={weightedAverages}
              totals={totals}
              currency={currency}
              metric={metric}
              cols={cols}
              colWidth={colWidth}
            />

            {cohorts?.map((cohort) => (
              <ClientRetentionTableRow
                key={cohort.name}
                cohort={cohort}
                currency={currency}
                cols={cols}
                colWidth={colWidth}
                metric={metric}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientRetentionTable;
