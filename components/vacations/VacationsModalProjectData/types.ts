import { VacationsArray } from 'types';

export type Props = {
  userCanSeeVacationFields: boolean | undefined;
  isEmployeeInBench: boolean;
  currentVacation: VacationsArray;
  isReplacedFieldIsLoading: boolean;
  usersFromSameDepartment: {
    id: number;
    avatar: string;
    title: string;
  }[];
  canNotEdit: boolean;
  vacationRequestDaysCount: number;
  getProjectExcludedStatus: (i: number) => string;
  holidayDates: string[];
};
