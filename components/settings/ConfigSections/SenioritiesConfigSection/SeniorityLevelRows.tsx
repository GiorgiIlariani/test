import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Menu } from 'components';
import { ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import ChildSeniorityRow from './ChildSeniorityRow';
import SeniorityRowActions from './SeniorityRowActions';
import { seniorityDeleteLabel } from './seniorityCopy';
import {
  seniorityRowClass,
  seniorityRowGridStyle,
  senioritySubgridStyle,
} from './seniorityRowStyle';
import {
  seniorityChildDroppableId,
  seniorityChildType,
  seniorityLevelType,
} from './useSenioritiesConfigSection';
import { SeniorityLevelRowsProps } from './types';

const childCountLabel = (count: number) => (count === 1 ? '1 child' : `${count} children`);

const SeniorityLevelRows = ({
  seniority,
  dragId,
  index,
  isDragDisabled,
  isChildDragActive,
  isExpanded,
  onToggle,
  onEdit,
  onAddChild,
  onDelete,
  actionsDisabled,
}: SeniorityLevelRowsProps) => {
  const title = seniority.title || 'Untitled';
  const children = seniority.children ?? [];
  const revealChildren = isExpanded || isChildDragActive;

  const { ref, handleRef, isDragging, isDropping } = useSortable({
    id: dragId,
    index,
    type: seniorityLevelType,
    accept: seniorityLevelType,
    disabled: isDragDisabled,
  });
  const { ref: childrenRef, isDropTarget } = useDroppable({
    id: seniorityChildDroppableId(dragId),
    accept: seniorityChildType,
  });

  return (
    <div
      ref={ref}
      className={twMerge('bg-card', isDragging && 'relative z-10 opacity-80 shadow-md')}
      style={seniorityRowGridStyle(isDragging || isDropping)}
    >
      <div className={seniorityRowClass} style={senioritySubgridStyle}>
        <div className='flex min-w-0 items-center gap-3 px-6 py-4'>
          <div ref={handleRef} className='h-4 w-4 shrink-0 cursor-grab'>
            <Menu stroke='stroke-muted-foreground' />
          </div>
          <button
            type='button'
            onClick={onToggle}
            aria-expanded={revealChildren}
            aria-label={`${revealChildren ? 'Collapse' : 'Expand'} ${title}`}
            className='shrink-0 text-muted-foreground'
          >
            <ChevronRight
              size={16}
              className={twMerge('transition-transform', revealChildren && 'rotate-90')}
            />
          </button>
          <span className='truncate font-semibold'>{title}</span>
        </div>
        <div className='px-6 py-4 text-right whitespace-nowrap text-muted-foreground'>
          {childCountLabel(children.length)}
        </div>
        <div />
        <div className='px-6 py-4'>
          <SeniorityRowActions
            showAddChild
            disabled={actionsDisabled}
            onAddChild={onAddChild}
            onEdit={() => onEdit(seniority, 'level')}
            onDelete={() => onDelete(seniority, seniorityDeleteLabel.level)}
          />
        </div>
      </div>
      {(revealChildren || children.length === 0) && (
        <div
          ref={childrenRef}
          className={twMerge(
            children.length === 0 &&
              (isChildDragActive || isDropTarget ? 'min-h-12 bg-muted/40' : 'min-h-px'),
          )}
          style={senioritySubgridStyle}
        >
          {revealChildren &&
            children.map((child, childIndex) => (
              <ChildSeniorityRow
                key={child.itemId ?? child.id ?? childIndex}
                child={child}
                parentId={dragId}
                index={childIndex}
                isDragDisabled={isDragDisabled}
                actionsDisabled={actionsDisabled}
                onEdit={() => onEdit(child, 'child')}
                onDelete={() => onDelete(child, seniorityDeleteLabel.child)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default SeniorityLevelRows;
