import { SetState, ListItem } from 'types';

export type Props = {
  list: ListItem[];
  setList: SetState<ListItem[]>;
  initialList: ListItem[];
  setInitialList: SetState<ListItem[]>;
  i: number;
  inputName: string;
  isOtherAdmin?: boolean;
  inputType: string;
  className?: string;
  canCreateListItem?: boolean;
  inputClass?: string;
  departmentList?: ListItem[];
  initialDepartmentList?: ListItem[];
  otherExpenseTitles: ListItem[];
  setDepartmentList?: SetState<ListItem[]>;
  isNumberAdded: boolean;
  isDisabled?: boolean;
};
