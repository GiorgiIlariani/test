import { Languages, SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  setRemovedItems?: SetState<number[]>;
  employeeId?: number;
  cvModal?: SectionNamePdf;
  languages: Languages[];
  levels: string[];
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
};
