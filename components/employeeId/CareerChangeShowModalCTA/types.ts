import { ActionTypes, SetState, ShowPageEmployee } from 'types';

export type Props = {
  currentCareerLog: ActionTypes;
  openDeleteLogModalHandler: () => void;
  setLogIsInEditMode: SetState<boolean>;
  logIsInEditMode: boolean;
  employee: ShowPageEmployee;
  displayPreviousButton?: boolean;
  previousButtonText?: string;
  previousButtonHandler?: () => void;
  isLoading?: boolean;
};
