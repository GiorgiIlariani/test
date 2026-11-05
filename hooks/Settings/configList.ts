import { ListType, SectionNames } from 'types';

export const listItemId = (item: ListType) => Number(item.itemId ?? item.id);

export const sameListId = (item: ListType, id: number) => listItemId(item) === id;

export const findListItem = (items: ListType[], id: number): ListType | undefined => {
  for (const item of items) {
    if (sameListId(item, id)) return item;

    const child = item.children?.find((entry) => sameListId(entry, id));
    if (child) return child;
  }
};

export const hasListTitle = (items: ListType[], title: string, exceptId?: number) => {
  const normalized = title.trim().toLowerCase();
  const matches = (entry: ListType) => entry.title?.trim().toLowerCase() === normalized;
  const isExcepted = (entry: ListType) => exceptId !== undefined && sameListId(entry, exceptId);

  return items.some((item) => {
    if (!isExcepted(item) && matches(item)) return true;
    return (item.children ?? []).some((child) => !isExcepted(child) && matches(child));
  });
};

export const updateListItem = (
  items: ListType[],
  id: number,
  patch: Partial<ListType>,
): ListType[] => items.map((item) => (sameListId(item, id) ? { ...item, ...patch } : item));

export const renameListItem = (items: ListType[], id: number, title: string): ListType[] =>
  items.map((item) => {
    if (sameListId(item, id)) return { ...item, title };

    if (!item.children?.some((child) => sameListId(child, id))) return item;

    return {
      ...item,
      children: item.children.map((child) => (sameListId(child, id) ? { ...child, title } : child)),
    };
  });

export const addListChild = (items: ListType[], parentId: number, child: ListType): ListType[] =>
  items.map((item) =>
    sameListId(item, parentId) ? { ...item, children: [child, ...(item.children ?? [])] } : item,
  );

export const removeListItem = (items: ListType[], id: number): ListType[] => {
  if (items.some((item) => sameListId(item, id))) {
    return items.filter((item) => !sameListId(item, id));
  }

  return items.map((item) =>
    item.children?.some((child) => sameListId(child, id))
      ? { ...item, children: item.children.filter((child) => !sameListId(child, id)) }
      : item,
  );
};

type SectionListApi = {
  form: {
    getValues: (name: SectionNames) => ListType[];
    setValue: (name: SectionNames, value: ListType[]) => void;
  };
  setInitialList: (updater: (current: ListType[]) => ListType[]) => void;
};

export const applySectionList = (
  sectionApi: SectionListApi,
  section: SectionNames,
  apply: (items: ListType[]) => ListType[],
) => {
  const values = sectionApi.form.getValues(section);
  sectionApi.form.setValue(section, apply(values));
  sectionApi.setInitialList((current) => apply(current));
};

export type ListPlacement = {
  beforeId: number | null;
  afterId: number | null;
  fallbackIndex: number;
};

const finiteId = (item?: ListType) => {
  if (!item) return null;
  const id = listItemId(item);
  return Number.isFinite(id) ? id : null;
};

const sameMembers = (left: ListType[], right: ListType[]) =>
  left.length === right.length && left.every((item, index) => item === right[index]);

export const placementAnchors = (
  items: ListType[],
  fromIndex: number,
  toIndex: number,
): ListPlacement | null => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return null;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) return null;
  next.splice(toIndex, 0, moved);
  const index = next.indexOf(moved);

  return {
    beforeId: finiteId(next[index + 1]),
    afterId: finiteId(next[index - 1]),
    fallbackIndex: index,
  };
};

export const insertionAnchors = (items: ListType[], toIndex: number): ListPlacement | null => {
  if (toIndex < 0 || toIndex > items.length) return null;

  return {
    beforeId: finiteId(items[toIndex]),
    afterId: finiteId(items[toIndex - 1]),
    fallbackIndex: toIndex,
  };
};

export const insertListItem = (
  items: ListType[],
  item: ListType,
  placement: ListPlacement,
): ListType[] => {
  const id = finiteId(item);
  const without = id == null ? [...items] : items.filter((entry) => !sameListId(entry, id));

  const place = (index: number) => {
    const next = [...without];
    next.splice(index, 0, item);
    return sameMembers(items, next) ? items : next;
  };

  if (placement.beforeId != null) {
    const beforeIndex = without.findIndex((entry) => sameListId(entry, placement.beforeId!));
    if (beforeIndex >= 0) return place(beforeIndex);
  }

  if (placement.afterId != null) {
    const afterIndex = without.findIndex((entry) => sameListId(entry, placement.afterId!));
    if (afterIndex >= 0) return place(afterIndex + 1);
  }

  return place(Math.max(0, Math.min(placement.fallbackIndex, without.length)));
};

export const placeListItem = (
  items: ListType[],
  id: number,
  placement: ListPlacement,
): ListType[] => {
  const current = items.find((item) => sameListId(item, id));
  if (!current) return items;
  return insertListItem(items, current, placement);
};

// Moves one failed reorder back beside its original neighbors. Items added, removed,
// or reordered after that drag stay where they are.
export const restoreListItem = (
  current: ListType[],
  movedId: number,
  original: ListType[],
): ListType[] => {
  const from = current.findIndex((item) => sameListId(item, movedId));
  const originalIndex = original.findIndex((item) => sameListId(item, movedId));
  if (from < 0 || originalIndex < 0) return current;

  const moved = current[from];
  const without = current.filter((_, index) => index !== from);
  const predecessors = new Set(
    original
      .slice(0, originalIndex)
      .map((item) => finiteId(item))
      .filter((id): id is number => id != null),
  );
  const originalIds = new Set(
    original.map((item) => finiteId(item)).filter((id): id is number => id != null),
  );

  let insertAt = without.length;
  for (let index = 0; index < without.length; index += 1) {
    const id = finiteId(without[index]);
    if (id == null || !originalIds.has(id)) continue;
    if (!predecessors.has(id)) {
      insertAt = index;
      break;
    }
  }

  const next = [...without];
  next.splice(insertAt, 0, moved);
  return sameMembers(current, next) ? current : next;
};

export const relocateChild = (
  items: ListType[],
  sourceParentId: number,
  destinationParentId: number,
  itemId: number,
  placement: ListPlacement,
): ListType[] => {
  const source = items.find((item) => sameListId(item, sourceParentId));
  const child = source?.children?.find((entry) => sameListId(entry, itemId));
  if (!source || !child || !items.some((item) => sameListId(item, destinationParentId))) {
    return items;
  }

  const moved = { ...child, parent_id: destinationParentId };

  return items.map((item) => {
    if (sameListId(item, sourceParentId) && sourceParentId !== destinationParentId) {
      return {
        ...item,
        children: (item.children ?? []).filter((entry) => !sameListId(entry, itemId)),
      };
    }

    if (!sameListId(item, destinationParentId)) return item;

    return { ...item, children: insertListItem(item.children ?? [], moved, placement) };
  });
};

export const restoreChildPlacement = (
  items: ListType[],
  movedId: number,
  sourceParentId: number,
  originalSourceChildren: ListType[],
): ListType[] => {
  let moved: ListType | undefined;
  const stripped = items.map((parent) => {
    const children = parent.children ?? [];
    const found = children.find((child) => sameListId(child, movedId));
    if (!found) return parent;

    moved = found;
    return { ...parent, children: children.filter((child) => !sameListId(child, movedId)) };
  });

  if (!moved) return items;
  if (!stripped.some((parent) => sameListId(parent, sourceParentId))) return stripped;

  const child = { ...moved, parent_id: sourceParentId };

  return stripped.map((parent) => {
    if (!sameListId(parent, sourceParentId)) return parent;

    return {
      ...parent,
      children: restoreListItem(
        [...(parent.children ?? []), child],
        movedId,
        originalSourceChildren,
      ),
    };
  });
};
