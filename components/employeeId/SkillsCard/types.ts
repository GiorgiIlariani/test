import { Ref } from 'react';
import { SectionNamePdf, SectionStatePdf, SetState } from 'types';

export type Props = {
  setRemovedItems?: SetState<number[]>;
  setIsFormSubmitted: SetState<boolean>;
  isFormSubmitted: boolean;
  cvModal?: SectionNamePdf;
  skillsRef?: Ref<HTMLDivElement>;
  setAreSkillsReordered?: SetState<boolean>;
  isShowMode?: boolean;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
};
