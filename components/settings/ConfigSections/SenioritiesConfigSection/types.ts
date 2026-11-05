import { ListType } from 'types';
import { DeleteFieldTarget, SaveFieldInput } from '../types';

export type Props = {
  fields: ListType[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReorderChild?: (
    sourceParentIndex: number,
    destinationParentIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => void;
  onDelete: (field: DeleteFieldTarget) => void;
  onSave?: (input: SaveFieldInput) => Promise<void>;
  loading: boolean;
};

export type SeniorityLevelRowsProps = {
  seniority: ListType;
  dragId: string;
  index: number;
  isDragDisabled: boolean;
  isChildDragActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (item: ListType, kind: 'level' | 'child') => void;
  onAddChild: () => void;
  onDelete: (item: ListType, label: string) => void;
  actionsDisabled: boolean;
};

export type ChildSeniorityRowProps = {
  child: ListType;
  parentId: string;
  index: number;
  isDragDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  actionsDisabled: boolean;
};

export type SenioritiesConfigSectionArgs = {
  fields: ListType[];
  onReorder: Props['onReorder'];
  onReorderChild?: Props['onReorderChild'];
  onDelete: Props['onDelete'];
  onSave?: Props['onSave'];
  loading: boolean;
};

export type SeniorityRowActionsProps = {
  showAddChild: boolean;
  disabled?: boolean;
  onAddChild?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
