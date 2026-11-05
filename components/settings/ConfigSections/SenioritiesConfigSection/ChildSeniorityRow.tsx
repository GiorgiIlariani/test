import { useSortable } from '@dnd-kit/react/sortable';
import { Menu } from 'components';
import { CornerDownRight } from 'lucide-react';
import SeniorityRowActions from './SeniorityRowActions';
import { twMerge } from 'tailwind-merge';
import { seniorityRowClass, seniorityRowGridStyle } from './seniorityRowStyle';
import { seniorityChildDraggableId, seniorityChildType } from './useSenioritiesConfigSection';
import { ChildSeniorityRowProps } from './types';

const ChildSeniorityRow = ({
  child,
  parentId,
  index,
  isDragDisabled,
  onEdit,
  onDelete,
  actionsDisabled,
}: ChildSeniorityRowProps) => {
  const title = child.title || 'Untitled';
  const childId = String(child.itemId ?? child.id ?? index);

  const { ref, handleRef, isDragging, isDropping } = useSortable({
    id: seniorityChildDraggableId(childId),
    index,
    group: parentId,
    type: seniorityChildType,
    accept: seniorityChildType,
    disabled: isDragDisabled,
  });

  return (
    <div
      ref={ref}
      className={twMerge(
        seniorityRowClass,
        isDragging && 'relative z-10 bg-card opacity-80 shadow-md',
      )}
      style={seniorityRowGridStyle(isDragging || isDropping)}
    >
      <div className='flex min-w-0 items-center gap-3 px-6 py-4'>
        <div ref={handleRef} className='h-4 w-4 shrink-0 cursor-grab'>
          <Menu stroke='stroke-muted-foreground' />
        </div>
        <span className='flex min-w-0 items-center gap-2 pl-6'>
          <CornerDownRight
            size={16}
            className='shrink-0 text-muted-foreground'
            aria-hidden='true'
          />
          <span className='truncate font-medium'>{title}</span>
        </span>
      </div>
      <div className='px-6 py-4 text-right whitespace-nowrap text-muted-foreground'>
        Child level
      </div>
      <div />
      <div className='px-6 py-4'>
        <SeniorityRowActions
          showAddChild={false}
          disabled={actionsDisabled}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default ChildSeniorityRow;
