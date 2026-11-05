import { SetState } from 'types';

export type Props = {
  children: ReactNode;
  sectionName: string;
  isEmpty?: boolean;
  addSectionModal?: SetState<boolean>;
  toggleModal?: () => void;
  toggleReorderModal?: () => void;
  canNotEdit?: boolean;
  reorder?: boolean;
  canReorder?: boolean;
};
