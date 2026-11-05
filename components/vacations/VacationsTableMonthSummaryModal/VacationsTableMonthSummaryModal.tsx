import React from 'react';
import { formatDate, getFullMonthNameFromPartial } from 'helpers';
import { ModalPortalWrapper, XButton, ArrowSymbol, CalendarIcon } from 'components';
import { twMerge } from 'tailwind-merge';
import { Props } from './Props';

const VacationsTableMonthSummaryModal: React.FC<Props> = ({
  employeeVacationsData,
  employeeId,
  employeeName,
  isCurrentUser,
  month,
  monthKey,
  openModal,
  openAddingInSetTime,
  onClose,
}) => {
  return (
    <ModalPortalWrapper hideHeader onClose={onClose}>
      <div className='p-6 sticky top-0 z-10 bg-white border-b'>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-3'>
          <div className='flex items-center justify-between'>
            <p className='text-slate-900 font-bold text-xl'>
              {employeeName} ({getFullMonthNameFromPartial(month)})
            </p>

            <XButton onClick={onClose} className='sm:hidden' />
          </div>

          {isCurrentUser && (
            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                className='text-slate-900 text-sm font-medium rounded-md py-1.5 px-3 border bg-white active:bg-gray-200 active:scale-[0.98] transition-all'
                onClick={openAddingInSetTime}
              >
                Add Vacation
              </button>

              <XButton onClick={onClose} className='hidden sm:flex' />
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4 p-6 text-slate-900'>
        {employeeVacationsData.map((vacation) => (
          <div
            key={vacation.id}
            className={twMerge(
              'p-4 rounded-2xl flex flex-col gap-2',
              vacation.status === 'approved' && 'bg-green-50',
              vacation.status === 'pending' && 'bg-orange-50',
              vacation.status === 'rejected' && 'bg-gray-50',
            )}
          >
            <div className='flex justify-between items-start'>
              <div className='flex flex-col gap-1'>
                <span className='font-bold capitalize'>{vacation.type}</span>
                <span
                  className={twMerge(
                    'text-xs px-2 py-0.5 rounded-full font-medium capitalize w-fit',
                    vacation.status === 'approved' && 'bg-green-100 text-green-600',
                    vacation.status === 'pending' && 'bg-orange-100 text-orange-600',
                    vacation.status === 'rejected' && 'bg-gray-100 text-gray-600',
                  )}
                >
                  {vacation.status}
                </span>
              </div>

              <div className='bg-white px-3 py-1 rounded-xl flex items-center gap-1.5'>
                <span className='text-sm font-bold text-slate-900'>
                  {vacation.number_of_vacation_days_in_month?.[monthKey] ?? 0}
                </span>
                <span className='text-2xs font-medium text-slate-400 uppercase tracking-tighter'>
                  Days
                </span>
              </div>
            </div>

            <div
              className={twMerge(
                'rounded-xl p-3 flex items-center justify-center gap-3 my-1',
                vacation.status === 'approved' && 'bg-green-100/50',
                vacation.status === 'pending' && 'bg-orange-100/50',
                vacation.status === 'rejected' && 'bg-gray-100/50',
              )}
            >
              <CalendarIcon className='size-4 text-indigo-600' />

              <div className='flex items-center gap-3 text-sm font-bold text-gray-800'>
                <span>{formatDate(vacation.start_date)}</span>
                <ArrowSymbol />
                <span>{formatDate(vacation.end_date)}</span>
              </div>
            </div>

            <div className='mb-2'>
              <p className='text-gray-600 uppercase text-2xs mb-1'>Reviewers</p>

              <div className='flex flex-col gap-1.5'>
                {vacation.reviewers.map((reviewer) => (
                  <div key={reviewer.id} className='flex items-center justify-between gap-1'>
                    <span className='font-medium capitalize text-xs'>
                      {reviewer.first_name} {reviewer.last_name}
                    </span>

                    <div
                      className={twMerge(
                        'text-[0.625rem] px-2 py-0.5 rounded-full font-medium capitalize',
                        reviewer.status === 'approved' && 'bg-green-100 text-green-600',
                        reviewer.status === 'pending' && 'bg-orange-100 text-orange-600',
                        reviewer.status === 'rejected' && 'bg-gray-100 text-gray-600',
                      )}
                    >
                      {reviewer.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className='mt-3 w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:bg-indigo-100 active:scale-[0.98] transition-all'
              onClick={() => {
                openModal([vacation], employeeId, vacation.status);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </ModalPortalWrapper>
  );
};

export default VacationsTableMonthSummaryModal;
