import { ChangeEvent } from 'react';
import { SectionNamePdf, SectionStatePdf, SetState, ShowPageEmployee } from 'types';

export type Props = {
  canNotEdit?: boolean;
  defaultValues?: ShowPageEmployee;
  needsDraft?: boolean;
  extraCardClasses?: string;
  cardNumber?: number;
  allInputsOnChangeHandler?: (e?: ChangeEvent) => void;
  needsUnfilledState?: boolean;
  cvModal?: SectionNamePdf;
  setLocationIsChanged?: SetState<boolean>;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
  location: string;
};
