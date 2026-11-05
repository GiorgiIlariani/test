import { ChangeEvent } from 'react';
import { AnyObject, SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  positions?: {
    id: number;
    title: string;
  }[];
  defaultValues?: AnyObject;
  canNotEdit?: boolean;
  needsDraft?: boolean;
  noPadding?: boolean;
  extraCardClasses?: string;
  cardNumber?: string;
  noTitle?: boolean;
  allInputsOnChangeHandler?: (e?: ChangeEvent) => void;
  needsUnfilledState?: boolean;
  draftOrContinuePicked?: boolean;
  setRemovedItems?: SetState<number[]>;
  cvModal?: SectionNamePdf;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
  enhanceCvWithAi?: (
    value: string,
    controller?: AbortController,
    statuses?: string[],
    index?: number,
  ) => Promise<{ cancelled: boolean }>;
  undoAiHandler?: (statuses?: string[]) => void;
};
