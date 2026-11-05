import { ProfileInfoModalState, SetState, ProfileSectionTitles, SectionInfo } from 'types';

export type Props = {
  sectionItemData: SectionInfo;
  setProfileSections: SetState<ProfileInfoModalState>;
  sectionName: ProfileSectionTitles;
  userId: number;
  setEmployee: SetState<ShowPageEmployee>;
};
