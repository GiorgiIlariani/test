import { UseFieldArrayRemove } from 'react-hook-form';
import { AnyObject, SetState } from 'types';

export type Props = {
  canNotEdit?: boolean;
  index: number;
  defaultValues?: AnyObject;
  industries: { id: number; title: string; name: string }[];
  remove: UseFieldArrayRemove;
  id: number;
  setRemovedItems: SetState<number[]>;
  cvModal?: boolean;
  enhanceCvWithAi?: (
    value: string,
    controller?: AbortController,
    statuses?: string[],
    index?: number,
  ) => Promise<{ cancelled: boolean }>;
  undoAiHandler?: (statuses?: string[]) => void;
};
