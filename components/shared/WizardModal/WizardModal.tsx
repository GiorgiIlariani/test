import { cn } from 'lib';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../Dialog';
import { Wizard, type WizardStep } from '../Wizard';
import type { WizardModalProps } from './types';

function WizardModal<const Steps extends readonly WizardStep[]>({
  open,
  onOpenChange,
  title,
  description,
  loading,
  loadingFallback,
  contentClassName,
  overlayClassName,
  ...wizardProps
}: WizardModalProps<Steps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('gap-0 p-0', contentClassName)}
        overlayClassName={overlayClassName}
      >
        {(title || description) && (
          <DialogHeader className='p-4 pb-2'>
            {loading ? (
              <div className='h-4 bg-muted rounded-md w-40' />
            ) : (
              <>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </>
            )}
          </DialogHeader>
        )}

        {loading ? (
          <div className='overflow-y-auto'>{loadingFallback}</div>
        ) : (
          <Wizard {...wizardProps} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WizardModal;
