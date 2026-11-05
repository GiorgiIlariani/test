import { GlobalApiInfo } from 'context';
import { compareIfSpecificDateFallsIntoTwoDates, EmployeeModel } from 'helpers';
import { useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { VacationsArray, VacationStatus } from 'types';
import { calculateTotalDays } from './helpers';

export const useVacationsTableMonthBox = (
  index: number,
  currentYear: number,
  currentEmployee: EmployeeModel,
  employeeId: number,
  openAddingInSetTime: (data: { year: number; month: number }) => void,
  openModal: (arg0: VacationsArray[], arg1: number, arg2: VacationStatus) => void,
) => {
  const { user } = useContext(GlobalApiInfo);
  const isMobile = useMediaQuery({ query: '(max-width: 949px)' });
  const [vacationsSummaryModalOpen, setVacationsSummaryModalOpen] = useState(false);

  const isCurrentUser = user.id === employeeId;

  const monthKey = `${currentYear}-${index + 1 > 9 ? index + 1 : `0${index + 1}`}`;

  const employeeVacationsData = currentEmployee.getEmployeeVacationsData(index, currentYear);

  const approvedVacationTotalDays = calculateTotalDays(employeeVacationsData, monthKey, 'approved');
  const pendingVacationTotalDays = calculateTotalDays(employeeVacationsData, monthKey, 'pending');
  const rejectedVacationTotalDays = calculateTotalDays(employeeVacationsData, monthKey, 'rejected');

  const vacationStatuses = [
    {
      type: 'approved',
      totalDays: approvedVacationTotalDays,
      mobileClasses: 'bg-green-400 text-white',
      desktopClasses:
        'md:bg-green-50 md:text-green-400 md:hover:bg-green-400 md:hover:text-green-50',
    },
    {
      type: 'pending',
      totalDays: pendingVacationTotalDays,
      mobileClasses: 'bg-orange-400 text-white',
      desktopClasses:
        'md:bg-orange-50 md:text-orange-400 md:hover:bg-orange-400 md:hover:text-orange-50',
    },
    {
      type: 'rejected',
      totalDays: rejectedVacationTotalDays,
      mobileClasses: 'bg-gray-400 text-white',
      desktopClasses: 'md:bg-gray-50 md:text-gray-400 md:hover:bg-gray-400 md:hover:text-gray-50',
    },
  ] as const;

  const isBonusMonth =
    currentEmployee.isBonusPeriod() &&
    compareIfSpecificDateFallsIntoTwoDates(
      currentYear,
      index + 1,
      currentEmployee.getAvailableBonusDates().fromDate,
      currentEmployee.getAvailableBonusDates().toDate,
    );

  const hasVacations = vacationStatuses.some((status) => status.totalDays > 0);

  const handleMonthBoxClick = () => {
    if (isMobile && hasVacations) {
      setVacationsSummaryModalOpen(true);
    } else if (isCurrentUser) {
      openAddingInSetTime({ year: currentYear, month: index + 1 });
    }
  };

  const handleStatusClick = (e: React.MouseEvent<HTMLElement>, status: VacationStatus) => {
    if (!isMobile) {
      e.stopPropagation();
      openModal(employeeVacationsData, employeeId, status);
    }
  };

  return {
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
  };
};
