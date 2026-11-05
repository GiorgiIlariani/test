import { UseFormReturn } from 'react-hook-form';
import { Courses, SetState } from 'types';

export type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  submitHandler: (data: Courses[], form: UseFormReturn<{ courses: Courses[] }>) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { courses: Courses[] };
  loading?: boolean;
};
