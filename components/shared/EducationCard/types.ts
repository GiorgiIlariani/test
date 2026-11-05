import { ChangeEvent } from 'react';
import { Education, SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  defaultEducations?: Education[];
  canNotEdit?: boolean;
  needsDraft?: boolean;
  doesNotNeedEducation?: boolean;
  doesNotNeedPadding?: boolean;
  extraCardClasses?: string;
  cardNumber?: number;
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
