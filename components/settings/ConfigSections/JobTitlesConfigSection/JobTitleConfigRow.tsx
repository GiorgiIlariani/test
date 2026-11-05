import { useSortable } from '@dnd-kit/react/sortable';
import { Badge, Menu, ShadcnTableCell, ShadcnTableRow } from 'components';
import { Check } from 'lucide-react';
import { JobTitleConfigRowProps } from './types';

const JobTitleConfigRow = ({
  jobTitle,
  index,
  isDragDisabled,
  actionsDisabled,
  onEdit,
  onDelete,
}: JobTitleConfigRowProps) => {
  const title = jobTitle.title || 'Untitled';

  const { ref, handleRef, isDragging } = useSortable({
    id: String(jobTitle.itemId ?? jobTitle.id ?? index),
    index,
    disabled: isDragDisabled,
  });

  return (
    <ShadcnTableRow
      ref={ref}
      className={isDragging ? 'relative z-10 bg-card opacity-80 shadow-md' : undefined}
    >
      <ShadcnTableCell>
        <div className='flex items-center gap-3'>
          <div ref={handleRef} className={isDragDisabled ? 'h-4 w-4' : 'h-4 w-4 cursor-grab'}>
            <Menu stroke='stroke-muted-foreground' />
          </div>
          <span>{title}</span>
        </div>
      </ShadcnTableCell>
      <ShadcnTableCell>
        {jobTitle.seniority_applicable ? (
          <Badge
            variant='success'
            className='h-auto gap-1.5 rounded-full px-3 py-1 text-sm font-normal'
          >
            <Check />
            Seniority applicable
          </Badge>
        ) : (
          <Badge variant='draft' className='h-auto rounded-full px-3 py-1 text-sm font-normal'>
            Not applicable
          </Badge>
        )}
      </ShadcnTableCell>
      <ShadcnTableCell>
        <div className='flex items-center justify-end gap-2'>
          <button
            type='button'
            disabled={actionsDisabled}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className='rounded-md px-2.5 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Edit
          </button>
          <button
            type='button'
            disabled={actionsDisabled}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className='rounded-md px-2.5 py-1 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Delete
          </button>
        </div>
      </ShadcnTableCell>
    </ShadcnTableRow>
  );
};

export default JobTitleConfigRow;
