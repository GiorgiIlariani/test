import { RefObject } from 'react';
import { Permission } from 'types';

export type Props = {
  tableHeaders: { id: number; title: string; isChecked: boolean }[];
  tableData: any[];
  openRowItem?: (arg: any) => void;
  tableFooters?: {
    title: string | number;
    hover?: string | undefined;
  }[];
  elementsRef: { current: RefObject<HTMLTableDataCellElement>[] } | null;
  isTableLoading: boolean;
  loadingRows?: number;
  tableType: 'Projects' | 'Terms' | 'Timesheets' | 'Staffing';
  tableWrapperClasses?: string;
  canHover?: boolean;
  filterIconStyles?: string;
  allowHorizontalScroll?: boolean;
  allowFilterRows?: boolean;
  externalFooter?: JSX.Element | JSX.Element[];
  externalOnMouseEnter?: (i: number | undefined) => void;
  hideFooter?: boolean;
  removeStickyHeader?: boolean;
  permissions: Permission[];
};
