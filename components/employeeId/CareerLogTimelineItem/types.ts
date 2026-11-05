import { ActionTypes, CareerHistory, ShowPageEmployee } from 'types';

export type Props = {
  careerLog: CareerHistory;
  firstOrLast: number | undefined;
  openDeleteLogModalHandler: (metaType: ActionTypes, id: number) => void;
  openLogInfoHandler: (arg0: ActionTypes, arg1: number) => void;
  careerLogLength: number;
  firstLogEntry: boolean;
  openEditLogInfoHandler: (type: ActionTypes, id: number) => void;
  organizationName: string | undefined;
  employee: ShowPageEmployee;
};
