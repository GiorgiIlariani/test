import { SetState } from 'types';

export type InputFieldProps = {
  index: number;
  fileErrors?: Record<string, string[] | null>;
  setFileErrors?: SetState<InputFieldProps['fileErrors']>;
  cvModal?: boolean;
  removeAchievements: () => void;
};
