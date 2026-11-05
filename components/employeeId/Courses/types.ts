import { UseFieldArrayRemove } from 'react-hook-form';
import { SetState } from 'types';

export type Props = {
  canNotEdit?: boolean;
  index: number;
  remove: UseFieldArrayRemove;
  setRemovedItems?: SetState<number[]>;
  id?: number;
  cvModal?: boolean;
};
