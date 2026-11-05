import { ProfileInfoModalState, SetState, ShowPageEmployee } from 'types';

export type Props = {
  addProfileInfoIsOpen: boolean;
  setAddProfileInfoIsOpen: SetState<boolean>;
  profileSection: ProfileInfoModalState;
  setProfileSections: SetState<ProfileInfoModalState>;
  userId: number;
  setEmployee: SetState<ShowPageEmployee>;
};
