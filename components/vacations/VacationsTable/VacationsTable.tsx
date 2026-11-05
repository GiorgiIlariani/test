import {
  Loader,
  VacationsTableFooter,
  VacationsTableFooterSkeleton,
  VacationsTableHeader,
  VacationsTableRow,
  VacationsTableSkeleton,
} from 'components';

import React from 'react';
import { Props } from './types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PARTIAL_MONTH_NAMES } from 'config';
import { useVacationsTable } from './useVacationsTable';
import { twMerge } from 'tailwind-merge';

const VacationsTable: React.FC<Props> = (props) => {
  const {
    tableRef,
    scrollableTarget,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useVacationsTable();

  return (
    <section
      id='vacations-table'
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={twMerge(
        'w-full mt-6 md:rounded-md md:overflow-auto md:border',
        isDragging && 'md:active:cursor-grabbing',
      )}
    >
      <VacationsTableHeader monthNames={PARTIAL_MONTH_NAMES} />

      {props.isLoading ? (
        <VacationsTableSkeleton monthNames={PARTIAL_MONTH_NAMES} />
      ) : (
        <InfiniteScroll
          dataLength={props.vacations.length}
          next={props.loadMoreVacations}
          hasMore={props.hasMoreVacations}
          loader={
            <div className='flex items-center justify-center p-4'>
              <Loader size='40px' border='3px' />
            </div>
          }
          scrollableTarget={scrollableTarget}
          className='space-y-4 md:space-y-0 pb-4 md:pb-0'
          style={{ overflow: 'visible' }}
        >
          {props.vacations.map((employee, index) => (
            <VacationsTableRow
              key={`${employee?.id}-${index}`}
              employee={employee}
              config={props.config}
              currentYear={props.currentYear}
              openAddingInSetTime={props.openAddingInSetTime}
              openModal={props.openModal}
              monthNames={PARTIAL_MONTH_NAMES}
            />
          ))}
        </InfiniteScroll>
      )}

      {props.isLoading ? (
        <VacationsTableFooterSkeleton />
      ) : (
        <VacationsTableFooter
          sumOfVacationsTable={props.sumOfVacationsTable}
          vacations={props.vacations}
          currentYear={props.currentYear}
          isLoading={props.isLoading}
        />
      )}
    </section>
  );
};

export default VacationsTable;
