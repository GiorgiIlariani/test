import { ReactNode } from 'react';
import { SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  noMargin?: boolean;
  noPadding?: boolean;
  extraClasses?: string;
  children: ReactNode;
  showTitle?: SectionNamePdf;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
  childrenWrapperClassName?: string;
};
