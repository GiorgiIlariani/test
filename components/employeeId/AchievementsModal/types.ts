import { UseFormReturn } from 'react-hook-form';
import { Achievements, SetState, ShowPageEmployee } from 'types';

export type Props = {
  form: UseFormReturn<{ achievements: Achievements[] }, any>;
  employee: ShowPageEmployee;
  toggleModal: () => void;
  isModalOpen: boolean;
  setValue: SetState<Achievements[]>;
  refetch: () => void;
  isLoading?: boolean;
};
