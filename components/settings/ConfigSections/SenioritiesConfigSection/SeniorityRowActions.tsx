import { SeniorityRowActionsProps } from './types';

const actionButtonClass =
  'rounded-md px-2.5 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50';

const SeniorityRowActions = ({
  showAddChild,
  disabled,
  onAddChild,
  onEdit,
  onDelete,
}: SeniorityRowActionsProps) => (
  <div
    className='flex items-center justify-end gap-2'
    onMouseDown={(event) => event.stopPropagation()}
  >
    {showAddChild && (
      <button type='button' disabled={disabled} onClick={onAddChild} className={actionButtonClass}>
        Add child level
      </button>
    )}
    <button type='button' disabled={disabled} onClick={onEdit} className={actionButtonClass}>
      Edit
    </button>
    <button
      type='button'
      disabled={disabled}
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
);

export default SeniorityRowActions;
