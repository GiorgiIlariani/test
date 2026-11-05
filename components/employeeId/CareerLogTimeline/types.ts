import { ActionTypes, CareerHistory, SetState, ShowPageEmployee } from 'types';

export type Props = {
  logIsLoading: boolean;
  setLogIsLoading: SetState<boolean>;
  careerLog: CareerHistory[];
  openDeleteLogModalHandler: (metaType: ActionTypes, id: number) => void;
  openLogInfoHandler: (type: ActionTypes, id: number) => void;
  openEditLogInfoHandler: (type: ActionTypes, id: number) => void;
  firstTypeOfLogEntry: (careerLog: CareerHistory[], careerLogItem: CareerHistory) => boolean;
  organizationName: string | undefined;
  employee: ShowPageEmployee;
};
