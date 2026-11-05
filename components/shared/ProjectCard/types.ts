import { ChangeEvent } from 'react';
import { AnyObject, SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  defaultValues?: AnyObject;
  canNotEdit?: boolean;
  draft?: AnyObject;
  needsDraft?: boolean;
  draftOrContinuePicked?: boolean;
  noCardPadding?: boolean;
  extraCardClasses?: string;
  cardNumber?: string;
  noTitle?: boolean;
  allInputsOnChangeHandler?: (e?: ChangeEvent) => void;
  needsUnfilledState?: boolean;
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
