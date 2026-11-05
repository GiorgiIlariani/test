import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from 'components';
import { ModalProps } from './types';
import { cn } from 'lib';

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  children,
  initialFocus = false,
  showCloseButton = true,
  showFooter = true,
  footer,
  title,
  description,
  loading,
  submitting,
  icon,
  iconWrapperClassName,
  contentClassName,
  overlayClassName,
  headerWrapperClassName,
  closeButtonText = 'Close',
  closeButtonVariant = 'outline',
  confirmButtonText = 'Save changes',
  confirmButtonTextLoading = 'Loading...',
  confirmButtonTextSubmitting = 'Saving...',
  confirmButtonVariant = 'default',
  confirmButtonType = 'button',
  confirmButtonDisabled = false,
  removeIconChildrenPadding = false,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        initialFocus={initialFocus}
        showCloseButton={showCloseButton}
        className={contentClassName}
        overlayClassName={overlayClassName}
      >
        {(title || description || showCloseButton || icon) && (
          <div className={cn('flex items-start gap-4', headerWrapperClassName)}>
            {icon && (
              <div
                className={cn(
                  'size-10 rounded-md bg-muted flex items-center justify-center',
                  iconWrapperClassName,
                )}
              >
                {icon}
              </div>
            )}

            <DialogHeader>
              {(title || description) && loading ? (
                <div className='h-4 bg-muted rounded-md w-40' />
              ) : (
                <>
                  {title && <DialogTitle>{title}</DialogTitle>}
                  {description && <DialogDescription>{description}</DialogDescription>}
                </>
              )}
            </DialogHeader>
          </div>
        )}

        <div
          className={cn(
            '-mx-4 -my-1 px-4 py-1 overflow-x-hidden overflow-y-auto',
            icon && !removeIconChildrenPadding && 'pl-18',
          )}
        >
          {children}
        </div>

        {showFooter &&
          (footer ?? (
            <DialogFooter>
              <DialogClose
                render={<Button variant={closeButtonVariant}>{closeButtonText}</Button>}
              />
              <Button
                type={confirmButtonType}
                variant={confirmButtonVariant}
                disabled={loading || submitting || confirmButtonDisabled}
                onClick={loading || submitting || confirmButtonDisabled ? () => {} : onConfirm}
              >
                {loading
                  ? confirmButtonTextLoading
                  : submitting
                  ? confirmButtonTextSubmitting
                  : confirmButtonText}
              </Button>
            </DialogFooter>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
