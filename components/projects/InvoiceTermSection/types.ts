import { SetState } from 'types';

export type Props = {
  isInShowMode: boolean;
  hasCompletion?: boolean;
  setHaveOtherExpenses?: SetState<boolean> | undefined;
  fields?: [];
  fieldName: string;
  canAddField?: boolean;
  vats?: { id: number; title: string; amount?: number }[];
};
