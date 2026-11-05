import { EmployeeFilterAndSortReducerDispatch, SetState } from 'types';

export type Props = {
  activeArchive: string[];
  setActiveArchive: SetState<string[]>;
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch;
  setArchiveActiveIsLoading: SetState<boolean>;
  archiveActiveIsLoading: boolean;
};

export type ArchiveFilter = 'active' | 'inactive';
