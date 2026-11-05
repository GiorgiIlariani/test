import { Table } from '@tanstack/react-table';
import { DraftCareerLogTableRow } from 'types';

export type Props = {
  table: Table<DraftCareerLogTableRow>;
  currentPage: number;
  pageCount: number;
  from?: number;
  to?: number;
  total?: number;
  isLoading: boolean;
};
