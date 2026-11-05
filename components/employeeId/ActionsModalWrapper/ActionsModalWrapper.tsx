import { Loader, ModalPortalWrapper } from 'components/shared';
import React from 'react';
import { Props } from './types';
import { useActionsModal } from './useActionsModal';

const ActionsModalWrapper: React.FC<Props> = (props) => {
  const { handleSubmit } = useActionsModal();
  return (
    <ModalPortalWrapper
      title={props.title}
      subtitle={props.subtitle}
      titleSuffix={props.titleSuffix && `(${props.titleSuffix})`}
      onClose={props.onClose}
    >
      <form onSubmit={handleSubmit(props.submitButtonHandler as (data?: any) => void)}>
        {props.children}

        {!props.disableButtons && (
          <div className='p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10'>
            <div className='h-10 flex items-center justify-end gap-2'>
              <button
                type='button'
                onClick={props.secondaryButtonHandler}
                className='px-4 h-full min-w-22 rounded-xl text-sm font-medium focus:ring-1 border border-zinc-200 hover:bg-gray-200 transition-all'
              >
                {props.secondaryButtonText}
              </button>

              <button
                type='submit'
                disabled={props.submitButtonDisabled}
                className='px-4 h-full min-w-22 rounded-xl bg-indigo-700 hover:bg-indigo-800 py-2 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-all'
              >
                {props.submitButtonText}
                {!props.loading || <Loader size={'16px'} border='2px' />}
              </button>
            </div>
          </div>
        )}
      </form>
    </ModalPortalWrapper>
  );
};

export default ActionsModalWrapper;
