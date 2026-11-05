import { UserProject } from 'types';

export type Props = {
  closeModal: () => void;
  userProjectsInfo: UserProject[];
  title?: string;
};
