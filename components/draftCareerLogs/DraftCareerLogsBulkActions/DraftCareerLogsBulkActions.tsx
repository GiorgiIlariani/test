import { Button, Separator, X } from 'components';
import { can } from 'helpers';
import { BadgeCheckIcon, TrashIcon } from 'lucide-react';
import { DraftCareerLogsBulkActionsProps } from './types';

const DraftCareerLogsBulkActions: React.FC<DraftCareerLogsBulkActionsProps> = ({
  selectedRows,
  permissions,
  onActivate,
  onDelete,
  onCancel,
}) => {
  return (
    <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300'>
      <div className='bg-background/60 backdrop-blur-md border border-border/50 shadow-2xl rounded-[1.125rem] pl-4 p-2 flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='bg-primary text-primary-foreground text-xs font-bold size-5 rounded-full flex items-center justify-center'>
            {selectedRows.length}
          </span>
          <span className='text-sm font-medium text-muted-foreground'>
            {selectedRows.length === 1 ? 'Log selected' : 'Logs selected'}
          </span>
        </div>

        <Separator orientation='vertical' className='h-4 w-px' />

        <div className='flex items-center gap-2'>
          {can('career-history::update', permissions) && (
            <Button variant='success' onClick={onActivate}>
              <BadgeCheckIcon />
              Activate
            </Button>
          )}

          {can('career-history::delete', permissions) && (
            <Button variant='destructive' onClick={onDelete}>
              <TrashIcon />
              Delete
            </Button>
          )}

          <Button variant='outline' onClick={onCancel}>
            <X />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftCareerLogsBulkActions;
