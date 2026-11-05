import { Permission } from 'types';

export type Props = {
  getExcelHandler: () => void | Promise<void>;
  excelButtonIsLoading: boolean;
  sumOfAllReviewableVacations: number;
  openReviewAllModal: () => void;
  isLoading: boolean;
  permissions: Permission[];
};
