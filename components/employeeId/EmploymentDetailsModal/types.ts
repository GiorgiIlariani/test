import { UseFormReturn } from 'react-hook-form';
import { Department, Position, Seniority } from 'types';
import { EmploymentDetailsFormValues } from '../EmploymentDetails/employmentDetailsSchema';

export type Props = {
  form: UseFormReturn<EmploymentDetailsFormValues>;
  onSubmit: (data: EmploymentDetailsFormValues) => Promise<void>;

  open: boolean;
  onOpenChange: (open: boolean) => void;

  canViewSalary: boolean;
  canEditLogInfo: boolean;
  isPreOffer: boolean;

  positions: Position[];
  seniorities: Seniority[];
  departments: Department[];

  loading: boolean;
};
