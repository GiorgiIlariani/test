import { Permission } from 'types';

export type Props = {
  classes: string;
  key: string | number;
  tableData: any;
  tableHeaders: { title: string; isChecked: boolean; id: number; truncate?: boolean }[];
  openRowItem?: (arg: number) => void;
  isLoading: boolean;
  canHover?: boolean;
  externalOnMouseEnter?: (i: number | undefined) => void;
  rowNumber?: number;
  permissions: Permission[];
};
