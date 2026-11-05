import { EmployeeVacations, Recruiter } from 'types';

export type Props = {
  reviewers: null | Recruiter[];
  toggleModal: () => void;
  updateVacations: () => void;
  adding:
    | boolean
    | {
        year: number;
        month: number;
      };
  currentYear: number;
  vacations: EmployeeVacations[];
};
