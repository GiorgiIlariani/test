import { SetState, Skills } from 'types';

export type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
  submitHandler: (data: Skills[]) => void;
  setRemovedItems: SetState<number[]>;
  defaultValues: { skills: Skills[] };
  setAreSkillsReordered?: SetState<boolean>;
  isShowMode?: boolean;
  loading?: boolean;
};
