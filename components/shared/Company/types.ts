import { ChangeEvent } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form';
import { AnyObject, SetState } from 'types';

export type Props = {
  index: number;
  canNotEdit: boolean | undefined;
  allInputsOnChangeHandler?: undefined | ((e?: ChangeEvent) => void);
  defaultValues: AnyObject | undefined;
  remove: UseFieldArrayRemove;
  setRemovedItems?: SetState<number[]>;
  id?: number;
  industry: { id: number; name: string; title: string }[];
  employmentType: { id: number; name: string; title: string }[];
  enhanceCvWithAi?: (
    value: string,
    controller?: AbortController,
    statuses?: string[],
    index?: number,
  ) => Promise<{ cancelled: boolean }>;
  undoAiHandler?: (statuses?: string[]) => void;
};
