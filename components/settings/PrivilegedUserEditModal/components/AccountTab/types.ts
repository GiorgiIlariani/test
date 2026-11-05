import { UseFormReturn } from 'react-hook-form';
import { PrivilegedUserEditFormFields } from 'types';

export type AccountTabProps = {
  form: UseFormReturn<PrivilegedUserEditFormFields>;
  roles: { id: number; name: string }[];
  canUpdate: boolean;
  canDelete: boolean;
  deleteError: string;
  onSubmit: (data: PrivilegedUserEditFormFields) => void;
  onDelete: () => void;
};
