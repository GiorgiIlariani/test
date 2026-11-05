import { ReactNode } from 'react';
import { SetState } from 'types';

type BaseProps = {
  children: ReactNode;
  sectionName: string;
  isEmpty?: boolean;
  addSectionModal?: SetState<boolean>;
  toggleModal?: () => void;
  canNotEdit?: boolean;
  employeeId: number;
};

type Reorder = { toggleReorderModal: () => void; reorder: boolean };
type ReorderNever = { toggleReorderModal?: never; reorder?: never };

export type Props = BaseProps & (Reorder | ReorderNever);
