import { UseFormReturn } from 'react-hook-form';
import { Languages, SetState } from 'types';

export type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  employeeId: number;
  submitHandler: (data: Languages[], form: UseFormReturn<{ languages: Languages[] }>) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { languages: Languages[] };
  loading?: boolean;
};
