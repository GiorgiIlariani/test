import {
  Permission,
  SetState,
  EmployeeVacations,
  VacationsArray,
  VacationStatus,
  FilterOptions,
  Department,
  Recruiter,
  VacationPeriod,
} from 'types';

export type Props = {
  closeModal: (latestVacationData?: VacationsArray[]) => void;
  vacationData: VacationsArray[];
  employeeMinimalData:
    | {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
        department: Department;
      }
    | undefined;
  updateVacations: (
    year?: number | undefined,
    argumentFilter?: FilterOptions[],
    page?: number,
    fullReload?: boolean,
  ) => Promise<void>;
  userId: number;
  currentVacationInfo: { sum: number; currentIndex: number };
  nextVacationModalData: () => void;
  previousVacationModalData: () => void;
  setVacationData: SetState<VacationsArray[]>;
  modalType: VacationStatus;
  setModalType: SetState<VacationStatus | undefined>;
  isInReviewAllMode: boolean;
  permissions: Permission[];
  filterOptions: FilterOptions[];
  currentPage: number;
  year: number;
  setVacations: SetState<EmployeeVacations[]>;
  reviewers: null | Recruiter[];
  vacations: EmployeeVacations[];
  isLoading: boolean;
  vacationPeriodsForIndividualVacation?: VacationPeriod[];
  employeesForReviewableVacations: EmployeeVacations[];
};
