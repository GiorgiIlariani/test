import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Project, SetState, ShowPageEmployee } from 'types';

export type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  submitHandler: (data: Project[], form: UseFormReturn<{ projects: Project[] }>) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { projects: Project[] };
  loading?: boolean;
  employee: ShowPageEmployee;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
