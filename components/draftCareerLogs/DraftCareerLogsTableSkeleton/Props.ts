import { ColumnDef } from '@tanstack/react-table';
import { DraftCareerLogTableRow } from 'types';

export type Props = {
  columns: ColumnDef<DraftCareerLogTableRow>[];
  rowCount: number;
};
