import { UseFormReturn } from 'react-hook-form';
import { SetState, ShowPageEmployee } from 'types';

export type Props = {
  form: UseFormReturn<{ brief_intro: string }, any>;
  employee: ShowPageEmployee;
  isModalOpen: boolean;
  toggleModal: () => void;
  setValue: SetState<string>;
  refetch: () => void;
};
