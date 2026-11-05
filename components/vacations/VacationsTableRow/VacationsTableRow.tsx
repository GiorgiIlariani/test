import { EmployeeModel, generateAvatarSrc, isUserFromBillableDepartment } from 'helpers';
import Image from 'next/image';
import React from 'react';
import {
  Airplane,
  FolderIcon,
  HeartCard,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VacationsTableMonthBox,
  VacationInfoDialog,
} from 'components';
import { Props } from './Props';

const VacationsTableRow: React.FC<Props> = ({
  employee,
  config,
  currentYear,
  openAddingInSetTime,
  openModal,
  monthNames,
}) => {
  const currentEmployee = new EmployeeModel(employee);

  return (
    <div
      className='flex flex-col border border-slate-100 rounded-3xl p-4 shadow-4xl bg-white
                 md:w-max md:min-w-full md:h-20 md:flex-row md:border-none md:rounded-none md:p-0 md:shadow-none'
    >
      <div className='flex justify-between gap-8 mb-4 md:contents'>
        <div
          className='flex items-center gap-2 bg-white min-w-0
                     md:w-62 md:border-r md:border-b md:px-5 md:sticky md:left-0 md:z-10'
        >
          <Image
            className='rounded-full size-12 shadow-md object-cover shrink-0
                       md:size-8 md:shadow-none'
            width={100}
            height={100}
            src={employee?.avatar ?? generateAvatarSrc(employee?.first_name, employee?.last_name)}
            alt={employee?.first_name}
          />

          <div
            className='flex flex-col gap-0.5 leading-none min-w-0
                       md:leading-normal md:gap-0'
          >
            <p className='leading-none text-sm font-bold md:text-base md:font-normal'>
              {currentEmployee.getEmployeeName()}
            </p>
            <p className='text-xs text-gray-500 truncate'>{employee.position?.title ?? ''}</p>

            <div className='flex items-center gap-1 text-gray-400 md:hidden'>
              <FolderIcon className='size-2 shrink-0' />
              <p className='text-2xs truncate'>
                {employee.projects?.map((project) => project.title).join(', ') ||
                  (isUserFromBillableDepartment(employee.department) ? 'Bench' : 'Secret Mission')}
              </p>
            </div>
          </div>
        </div>

        <div className='hidden md:flex w-54 items-center border-r border-b'>
          {employee.projects.length === 0 ? (
            <p className='px-5 w-full'>
              {isUserFromBillableDepartment(employee.department) ? 'Bench' : 'Secret Mission'}
            </p>
          ) : (
            <Tooltip>
              <TooltipTrigger className='px-5 text-start size-full truncate'>
                {employee.projects.map((project) => project.title).join(', ')}
              </TooltipTrigger>

              <TooltipContent side='right' className='shadow-sm text-base'>
                {employee.projects.map((project) => project.title).join(', ')}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div
          className='flex items-end justify-center flex-col bg-white shrink-0
                     md:w-44 md:border-r md:border-b md:px-5 md:sticky md:left-62 md:z-10'
        >
          <div className='flex items-center gap-1.5'>
            <div className='text-indigo-600 flex items-center gap-0.5 md:text-current'>
              <Airplane className='size-3 md:hidden' />
              <p
                className='font-bold text-sm
                           md:font-normal md:text-base'
              >
                {currentEmployee.sumOfVacationDaysUsed()}
              </p>
            </div>

            <div className='text-orange-600 flex items-center gap-0.5 md:text-current md:hidden'>
              <HeartCard className='size-3' />
              <p
                className='font-bold text-sm
                           md:font-normal md:text-base'
              >
                {currentEmployee.sumOfSickDaysUsed()}
              </p>
            </div>
          </div>

          {currentEmployee.isBonusPeriod() && config.trial_bonus_days ? (
            <div className='flex flex-col items-end text-xs text-gray-400 md:gap-1'>
              <VacationInfoDialog
                trigger={
                  currentEmployee.isBonusExpired()
                    ? 'Bonus expired'
                    : `Bonus left ${currentEmployee.numberOfBonusDaysLet()}`
                }
                fromDate={currentEmployee.getAvailableBonusDates().fromDate}
                toDate={currentEmployee.getAvailableBonusDates().toDate}
              />

              <VacationInfoDialog
                trigger={
                  currentEmployee.isBonusExpired()
                    ? `Vacations left ${currentEmployee.numberOfVacationDaysLeft(true)}`
                    : `Upcoming days ${currentEmployee.numberOfVacationDaysLeft(true)}`
                }
                fromDate={currentEmployee.getAvailableVacationDates().fromDate}
                toDate={currentEmployee.getAvailableVacationDates().toDate}
              />
            </div>
          ) : (
            <p className='text-2xs text-gray-400 md:text-xs'>
              Vacation left {currentEmployee.numberOfVacationDaysLeft()}
            </p>
          )}
        </div>

        <div
          className='hidden w-34 px-5 items-center justify-end
                     md:flex md:border-r md:border-b'
        >
          <p>{currentEmployee.sumOfSickDaysUsed()}</p>
        </div>
      </div>

      <div
        className='flex justify-between gap-2 overflow-x-auto no-scrollbar
                   md:grid md:gap-0 md:overflow-visible'
        style={{ gridTemplateColumns: `repeat(${monthNames.length}, 6.5rem)` }}
      >
        {monthNames.map((month, index) => (
          <VacationsTableMonthBox
            key={`${month}-${index}`}
            month={month}
            index={index}
            currentYear={currentYear}
            currentEmployee={currentEmployee}
            employeeId={employee.id}
            openAddingInSetTime={openAddingInSetTime}
            openModal={openModal}
          />
        ))}
      </div>
    </div>
  );
};

export default VacationsTableRow;
