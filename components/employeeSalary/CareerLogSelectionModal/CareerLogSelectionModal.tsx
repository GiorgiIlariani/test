import { ModalPortalWrapper, Plus, Badge } from 'components';
import { logIcon } from 'components/employeeId/CareerLogTimelineItem/helpers';
import { formatMonthYear, getFormattedDate } from 'helpers';
import React from 'react';
import { Props } from './Props';
import { ChevronRight } from 'lucide-react';

const CareerLogSelectionModal: React.FC<Props> = ({
  onClose,
  onAddLogClick,
  onEditLogClick,
  cellData,
  selectedEmployee,
  careerLog,
  isLoading,
}) => {
  const hasCareerLogs = careerLog && careerLog.length > 0;

  return (
    <ModalPortalWrapper
      title='Career Logs'
      subtitle={
        isLoading ? (
          <div className='h-5 w-48 bg-gray-200 animate-pulse rounded-sm' />
        ) : (
          `${selectedEmployee?.first_name} ${selectedEmployee?.last_name} • ${formatMonthYear(
            cellData?.month!,
          )}`
        )
      }
      onClose={onClose}
    >
      <div className='flex flex-col h-full'>
        <div className='p-6'>
          <p className='text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider'>
            Existing logs for this month
          </p>

          <div className='flex flex-col gap-3'>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, id) => (
                <div
                  key={id}
                  className='flex items-center h-17.5 w-full bg-gray-200 animate-pulse rounded-xl'
                />
              ))
            ) : hasCareerLogs ? (
              careerLog.map((log) => (
                <button
                  key={log.id}
                  onClick={() => onEditLogClick(log.type, log.id)}
                  className='group relative flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={`flex size-8 items-center justify-center rounded-full 
                      ${logIcon(log)?.color} ${log.status === 'draft' ? 'saturate-0' : ''}`}
                    >
                      {logIcon(log)?.icon}
                    </div>

                    <div>
                      <h3 className='font-bold text-slate-900 leading-none mb-1'>
                        {log.type} Update
                      </h3>

                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-zinc-400'>{getFormattedDate(log.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <Badge
                      variant={log.status === 'active' ? 'success' : 'draft'}
                      className='capitalize border-dashed'
                    >
                      {log.status}
                    </Badge>

                    <div className='flex items-center gap-1 text-xs font-bold text-indigo-600 opacity-0 w-0 ml-0 group-hover:opacity-100 group-hover:w-10 group-hover:ml-3 transition-all'>
                      <span>EDIT</span>
                      <ChevronRight />
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center gap-3 h-38 border border-dashed rounded-xl border-gray-200 bg-gray-50/50'>
                <p className='text-sm font-bold text-zinc-500 group-hover:text-indigo-700 transition-colors duration-300'>
                  No career logs found for this month
                </p>

                <button
                  onClick={onAddLogClick}
                  className=' flex items-center justify-center gap-2 py-3.5 px-8 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold transition-all shadow-xs shadow-indigo-200'
                >
                  <Plus />
                  <span>Add New Career Log</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {hasCareerLogs && (
          <div className='border-t border-gray-100 p-6 sticky bottom-0 z-10 bg-white'>
            <button
              onClick={onAddLogClick}
              className='w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold transition-all shadow-xs shadow-indigo-200'
            >
              <Plus />
              <span>Add New Career Log</span>
            </button>
          </div>
        )}
      </div>
    </ModalPortalWrapper>
  );
};

export default CareerLogSelectionModal;
