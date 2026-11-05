import { DraftCareerLogLeafRow, Permission } from 'types';

export type DraftCareerLogsBulkActionsProps = {
  selectedRows: DraftCareerLogLeafRow[];
  permissions: Permission[];
  onActivate: () => void;
  onDelete: () => void;
  onCancel: () => void;
};
