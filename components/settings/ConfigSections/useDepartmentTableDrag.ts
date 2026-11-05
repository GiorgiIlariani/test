import { isSortable } from '@dnd-kit/react/sortable';
import { DepartmentTableDragArgs } from './types';

export const useDepartmentTableDrag = ({ search, onReorder }: DepartmentTableDragArgs) => {
  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (!isSortable(source)) return;

    const { initialIndex, index } = source.sortable;

    if (initialIndex !== index) onReorder(initialIndex, index);
  };

  return {
    onDragEnd,
    isDragDisabled: search.trim().length > 0,
  };
};
