import { ListType } from 'types';
import { DeleteFieldTarget } from './types';

export const deleteTarget = (item: ListType, label: string): DeleteFieldTarget => ({
  id: Number(item.itemId ?? item.id),
  name: item.title || 'Untitled',
  label,
});
