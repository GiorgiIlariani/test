import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useVacationsTableMonthBox } from './useVacationsTableMonthBox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VacationsTableMonthSummaryModal,
} from 'components';
import { Props } from './Props';
import { getDayAndMonth, getVacationEmoji, isDayOff } from './helpers';

const VacationsTableMonthBox: React.FC<Props> = ({
  month,
  index,
  currentYear,
  currentEmployee,
  employeeId,
  openAddingInSetTime,
  openModal,
}) => {
  const {
    user,
    vacationsSummaryModalOpen,
    setVacationsSummaryModalOpen,

    handleMonthBoxClick,
    handleStatusClick,

    employeeVacationsData,
    approvedVacationTotalDays,
    pendingVacationTotalDays,
    rejectedVacationTotalDays,

    vacationStatuses,
    isCurrentUser,
    isBonusMonth,
    monthKey,
  } = useVacationsTableMonthBox(
    index,
    currentYear,
    currentEmployee,
    employeeId,
    openAddingInSetTime,
    openModal,
  );

  return (
    <>
      <div
        key={`${month}-${index}`}
        onClick={handleMonthBoxClick}
        className={twMerge(
          'flex flex-col items-center content-center gap-1 h-fit md:flex-row md:flex-wrap md:justify-center md:h-auto md:border-r md:border-b',
          user.id === employeeId && 'cursor-pointer',
          isBonusMonth && 'md:bg-zinc-100',
        )}
      >
        <div
          className={twMerge(
            'font-semibold rounded-full size-10 shrink-0 flex items-center justify-center text-xs uppercase md:hidden',
            isBonusMonth ? 'bg-gray-300 text-white' : 'bg-gray-50 text-gray-500',
            rejectedVacationTotalDays > 0 &&
              'border-2 border-gray-300 text-gray-400 bg-gray-50 shadow-xs',
            pendingVacationTotalDays > 0 &&
              'border-2 border-orange-300 text-orange-400 bg-orange-50 shadow-xs',
            approvedVacationTotalDays > 0 &&
              'border-2 border-green-300 text-green-400 bg-green-50 shadow-xs',
          )}
        >
          {month[0]}
        </div>

        {vacationStatuses
          .filter((status) => status.totalDays > 0)
          .map((status) => (
            <Tooltip key={status.type}>
              <TooltipTrigger
                className={twMerge(
                  'font-bold text-2xs rounded-full size-5 shadow-xs flex items-center justify-center cursor-pointer transition-colors md:size-8 md:text-base md:font-medium',
                  status.mobileClasses,
                  status.desktopClasses,
                )}
                onClick={(e) => handleStatusClick(e, status.type)}
              >
                {status.totalDays}
              </TooltipTrigger>

              <TooltipContent className='shadow-sm flex-col items-start'>
                {employeeVacationsData
                  .filter((vacation) => vacation.status === status.type)
                  .map((vacation, index) => (
                    <div key={vacation.id ?? index} className='flex items-center gap-2'>
                      <span>{getVacationEmoji(vacation.type, vacation.start_date)}</span>
                      <span className='capitalize font-semibold'>{vacation.type}:</span>
                      <span>
                        {isDayOff(vacation.start_date, vacation.end_date)
                          ? getDayAndMonth(vacation.start_date)
                          : `${getDayAndMonth(vacation.start_date)} - ${getDayAndMonth(
                              vacation.end_date,
                            )}`}
                      </span>
                    </div>
                  ))}
              </TooltipContent>
            </Tooltip>
          ))}
      </div>

      {vacationsSummaryModalOpen && (
        <VacationsTableMonthSummaryModal
          employeeVacationsData={employeeVacationsData}
          employeeId={employeeId}
          employeeName={currentEmployee.getEmployeeName()}
          isCurrentUser={isCurrentUser}
          month={month}
          monthKey={monthKey}
          openModal={openModal}
          openAddingInSetTime={() => openAddingInSetTime({ year: currentYear, month: index + 1 })}
          onClose={() => setVacationsSummaryModalOpen(false)}
        />
      )}
    </>
  );
};

export default VacationsTableMonthBox;
