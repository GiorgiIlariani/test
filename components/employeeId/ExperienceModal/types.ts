import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Experiences, SetState, ShowPageEmployee } from 'types';

export type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  submitHandler: (data: Experiences[], form: UseFormReturn<{ experiences: Experiences[] }>) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { experiences: Experiences[] };
  loading?: boolean;
  employee: ShowPageEmployee;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
