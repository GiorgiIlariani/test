import { SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  setIds?: SetState<number[]>;
  fileErrors?: Record<string, string[] | null>;
  setFileErrors?: SetState<Props['fileErrors']>;
  cvModal?: SectionNamePdf;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
};
