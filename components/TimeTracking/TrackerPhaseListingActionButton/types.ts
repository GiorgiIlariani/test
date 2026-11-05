import { SetState } from 'types';

export type Props = {
  isSaving: boolean;
  setIsSubmitClicked: SetState<boolean | number[]>;
  timeLogIds: number[];
  termIsDisabled: boolean;
  setIsInEditMode: SetState<boolean>;
  isInEditMode: boolean;
};
