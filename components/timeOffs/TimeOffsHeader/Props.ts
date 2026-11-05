import { Permission } from 'types';

export type Props = {
  selectYearHandler: (year: number) => void | Promise<void>;
  currentYear: number;
  getExcelHandler: () => void | Promise<void>;
  excelButtonIsLoading: boolean;
  sumOfAllReviewableVacations: number;
  openReviewAllModal: () => void;
  toggleAdding: () => void;
  isLoading: boolean;
  permissions: Permission[];
};
