import { useState } from 'react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useConfigFieldEditor } from 'hooks/Settings/useConfigFieldEditor';
import { ListType } from 'types';
import { deleteTarget } from '../deleteFieldTarget';
import { seniorityFieldCopy } from './seniorityCopy';
import { SenioritiesConfigSectionArgs } from './types';

const seniorityChildDroppablePrefix = 'seniority-children-';

export const seniorityLevelType = 'seniority-level';

export const seniorityChildType = 'seniority-child';

export const seniorityChildDraggableId = (childId: string) => `child-${childId}`;

export const seniorityChildDroppableId = (parentKey: string) =>
  `${seniorityChildDroppablePrefix}${parentKey}`;

const seniorityKey = (seniority: ListType, index: number) =>
  String(seniority.itemId ?? seniority.id ?? index);

const parentIndexForKey = (fields: ListType[], parentKey: unknown) =>
  fields.findIndex((seniority, index) => seniorityKey(seniority, index) === String(parentKey));

const matchesQuery = (title: string | undefined, query: string) =>
  (title || 'Untitled').toLowerCase().includes(query);

const levelId = (item: ListType) => Number(item.itemId ?? item.id);

export const useSenioritiesConfigSection = ({
  fields,
  onReorder,
  onReorderChild = () => undefined,
  onDelete,
  onSave = async () => undefined,
  loading,
}: SenioritiesConfigSectionArgs) => {
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);
  const [isDraggingChild, setIsDraggingChild] = useState(false);
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;
  const isDragDisabled = isSearching;
  const { editor, submitting, openEditor, closeEditor, submitEditor } = useConfigFieldEditor(
    fields,
    onSave,
  );

  const expandKey = (key: string) => {
    setExpandedIds((current) => {
      if (current === null || current.has(key)) return current;
      const next = new Set(current);
      next.add(key);
      return next;
    });
  };

  const onDragStart = (event: any) => {
    if (event.operation.source?.type === seniorityChildType) setIsDraggingChild(true);
  };

  // dnd-kit would physically move the row's DOM node into the other parent while dragging,
  // which makes React fail on removeChild. For cross-parent moves we skip that preview and
  // resolve the destination in onDragEnd from the drop target instead.
  const onDragOver = (event: any) => {
    const { source, target } = event.operation;
    if (
      isSortable(source) &&
      isSortable(target) &&
      source.sortable.group !== target.sortable.group
    ) {
      event.preventDefault();
    }
  };

  const onDragEnd = (event: any) => {
    setIsDraggingChild(false);
    if (event.canceled || isDragDisabled) return;

    const { source, target } = event.operation;
    if (!isSortable(source)) return;

    const { initialIndex, index, initialGroup, group } = source.sortable;

    if (source.type === seniorityLevelType) {
      if (initialIndex !== index) onReorder(initialIndex, index);
      return;
    }

    const sourceParentIndex = parentIndexForKey(fields, initialGroup);
    let destinationParentIndex = parentIndexForKey(fields, group);
    let destinationIndex = index;

    if (isSortable(target) && target.sortable.group !== initialGroup) {
      const rect = target.sortable.element?.getBoundingClientRect();
      const pointerY = event.operation.position.current.y;
      const isBelowTarget = !!rect && pointerY > rect.top + rect.height / 2;

      destinationParentIndex = parentIndexForKey(fields, target.sortable.group);
      destinationIndex = target.sortable.index + (isBelowTarget ? 1 : 0);
    }

    // Dropping onto an empty child list: the target is that list's droppable, not a sortable.
    const targetId = String(target?.id ?? '');
    if (target && !isSortable(target) && targetId.startsWith(seniorityChildDroppablePrefix)) {
      const emptyParentIndex = parentIndexForKey(
        fields,
        targetId.slice(seniorityChildDroppablePrefix.length),
      );
      if (emptyParentIndex >= 0 && !fields[emptyParentIndex].children?.length) {
        destinationParentIndex = emptyParentIndex;
        destinationIndex = 0;
      }
    }

    if (sourceParentIndex < 0 || destinationParentIndex < 0) return;
    if (sourceParentIndex === destinationParentIndex && initialIndex === destinationIndex) return;

    onReorderChild(sourceParentIndex, destinationParentIndex, initialIndex, destinationIndex);

    if (sourceParentIndex !== destinationParentIndex) {
      expandKey(seniorityKey(fields[destinationParentIndex], destinationParentIndex));
    }
  };

  const visibleLevels = fields
    .map((seniority, index) => ({ seniority, index }))
    .filter(({ seniority }) => {
      if (!isSearching) return true;

      const children = seniority.children ?? [];
      return (
        matchesQuery(seniority.title, query) ||
        children.some((child) => matchesQuery(child.title, query))
      );
    });

  const childCount = fields.reduce((sum, seniority) => sum + (seniority.children?.length ?? 0), 0);

  const allKeys = () => fields.map((seniority, index) => seniorityKey(seniority, index));

  const isExpanded = (seniority: ListType, index: number) =>
    isSearching || expandedIds === null || expandedIds.has(seniorityKey(seniority, index));

  const toggleLevel = (seniority: ListType, index: number) => {
    const key = seniorityKey(seniority, index);
    setExpandedIds((current) => {
      const next = new Set(current ?? allKeys());
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(allKeys()));
  const collapseAll = () => setExpandedIds(new Set());

  const handleSubmit = async (value: { title: string }) => {
    const result = await submitEditor(value);
    if (result.status === 'error') return result.message;
    if (result.status !== 'success') return;
    if (result.created) setSearch('');
    if (result.parentKey) expandKey(result.parentKey);
  };

  const openCreateLevel = () =>
    openEditor({ mode: 'create', name: '', copy: seniorityFieldCopy.level.create });

  const openEditLevel = (item: ListType, kind: 'level' | 'child') =>
    openEditor({
      mode: 'edit',
      id: levelId(item),
      name: item.title || '',
      copy: seniorityFieldCopy[kind].edit,
    });

  const openAddChild = (seniority: ListType, index: number) =>
    openEditor({
      mode: 'create',
      parentId: levelId(seniority),
      parentKey: seniorityKey(seniority, index),
      name: '',
      copy: seniorityFieldCopy.child.create,
    });

  const deleteLevel = (item: ListType, label: string) => onDelete(deleteTarget(item, label));

  return {
    search,
    setSearch,
    onDragStart,
    onDragOver,
    onDragEnd,
    isChildDragActive: isDraggingChild,
    visibleLevels,
    childCount,
    seniorityKey,
    isExpanded,
    toggleLevel,
    expandAll,
    collapseAll,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreateLevel,
    openEditLevel,
    openAddChild,
    deleteLevel,
    dragDisabled: isDragDisabled || loading,
    actionsDisabled: loading,
  };
};
