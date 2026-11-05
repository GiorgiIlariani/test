import { SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  canNotEdit?: boolean;
  extraCardClasses?: string;
  cvModal?: SectionNamePdf;
  setRemovedItems?: SetState<number[]>;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
};
