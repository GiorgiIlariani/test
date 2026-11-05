import { Backdrop, Loader, PortalWrapper, X } from 'components';
import { Props } from './types';
import { FormProvider } from 'react-hook-form';
import { useEsc } from 'hooks';
import { twMerge } from 'tailwind-merge';

const ModalWrapper = (props: Props) => {
  useEsc(props.handleClose);

  const dialog = (
    <dialog
      className={twMerge(
        'block relative mx-auto w-full max-h-[calc(100vh-4.5rem)] overflow-y-auto max-w-306 rounded-lg bg-white p-0',
        props.className,
      )}
    >
      {!props.hideHeader &&
        (props.customHeader ?? (
          <header
            className={`${props.headerClassName} flex justify-between px-6 py-4 sticky top-0 z-99999 bg-white border-b border-zinc-200`}
          >
            {props.isLoading ? (
              <div className='text-gray-300 bg-gray-300 h-4 w-24 pt-6 animate-pulse select-none rounded-md'></div>
            ) : (
              <h3
                className={`${props.titleClassName} capitalize font-bold text-slate-900 text-base`}
              >
                {props.title}
              </h3>
            )}
            <button
              className='hover:bg-gray-200 p-1 rounded-full'
              onClick={props.handleClose}
              type='button'
            >
              <X />
            </button>
          </header>
        ))}

      {props.handleSubmit ? (
        <FormProvider {...props.form}>
          <form
            onSubmit={props.form.handleSubmit(props.handleSubmit)}
            className={props.formClassName}
          >
            <fieldset className={props.childClasses}>{props.children}</fieldset>
            {!props.hideFooter ? (
              <footer
                className={`flex justify-end border-t border-zinc-200 sticky bottom-0 bg-white z-10`}
              >
                {props.customFooter ?? (
                  <div className='flex gap-4 px-4 py-3'>
                    <button
                      type='button'
                      className='rounded-md border hover:bg-gray-200 border-zinc-200 bg-white py-2 px-3 text-sm font-medium text-zinc-700 focus:ring-1 focus:ring-indigo-600'
                      onClick={props.handleClose}
                    >
                      {props.cancelText ?? 'Cancel'}
                    </button>
                    <div className='flex items-center justify-center'>
                      {props.submitButton ?? (
                        <button
                          type='submit'
                          disabled={props.isLoading}
                          className='flex items-center gap-2 rounded-md bg-indigo-600 py-2 px-3 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2'
                        >
                          {props.submitText ?? 'Submit'}
                          {!props.isLoading || <Loader size='16px' border='2px' />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </footer>
            ) : null}
          </form>
        </FormProvider>
      ) : (
        <section>{props.children}</section>
      )}
    </dialog>
  );

  return props.isOpen ? (
    <>
      {!props.isDropdown ? (
        <PortalWrapper className='block justify-center items-start pt-6 pb-12 text-sm'>
          {!props.hideBackdrop && <Backdrop onClick={props.handleClose} />}
          {dialog}
        </PortalWrapper>
      ) : (
        <>
          {props.triangle}
          {dialog}
        </>
      )}
    </>
  ) : null;
};

export default ModalWrapper;
