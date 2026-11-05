import { SetState } from 'types';

export type Props = {
  isInShowMode: boolean;
  haveOtherExpenses?: boolean;
  setHaveOtherExpenses?: SetState<boolean> | undefined;
  expenses?: [];
  vats?: { id: number; title: string }[];
};
