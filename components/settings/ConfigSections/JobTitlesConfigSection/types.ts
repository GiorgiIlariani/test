import { ListType } from 'types';
import { DeleteFieldTarget, SaveFieldInput } from '../types';

export type Props = {
  fields: ListType[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (field: DeleteFieldTarget) => void;
  onSave?: (input: SaveFieldInput) => Promise<void>;
  loading: boolean;
};

export type JobTitleConfigRowProps = {
  jobTitle: ListType;
  index: number;
  isDragDisabled: boolean;
  actionsDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};
