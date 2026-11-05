import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Education, SetState, ShowPageEmployee } from 'types';

export type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  submitHandler: (data: Education[], form: UseFormReturn<{ education: Education[] }>) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { education: Education[] };
  loading?: boolean;
  employee: ShowPageEmployee;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
