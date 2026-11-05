import React from 'react';
import { Backdrop, DeleteX, Loader } from 'components';
import { Props } from './types';

const ErrorModal: React.FC<Props> = (props) => {
  return (
    <>
      {!props.disabled ? (
        <div
          className='fixed inset-0 z-999999 overflow-y-auto'
          aria-labelledby='modal-title'
          role='dialog'
          aria-modal='true'
        >
          <div className='flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <Backdrop extraClasses={props.backdropClasses} onClick={() => props.closeHandler()} />

            <span className='hidden sm:inline-block sm:h-screen sm:align-middle' aria-hidden='true'>
              &#8203;
            </span>

            <div className='relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xs transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle'>
              <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
                <button
                  type='button'
                  onClick={() => props.closeHandler()}
                  className='cursor-pointer hover:bg-gray-200 p-1 rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  <span className='sr-only'>Close</span>
                  <DeleteX />
                </button>
              </div>
              <div className='sm:flex sm:items-start'>
                <div
                  className={`mx-auto shrink-0 ${props.iconBackgroundColor} flex h-12 w-12 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10`}
                >
                  {props.icon}
                </div>
                <div className='mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-title'>
                    {props.modalTitle}
                  </h3>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>{props.modalMessage}</p>
                    <p className='text-sm text-gray-500 mt-2'>{props.modalSecondaryMessageSpan}</p>
                  </div>
                </div>
              </div>

              <div className='mt-5 flex items-center justify-end gap-2 sm:mt-4'>
                <button
                  type='button'
                  onClick={() => props.closeHandler()}
                  className='cursor-pointer inline-flex justify-center rounded-md border border-gray-300 hover:bg-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm'
                >
                  {props.cancelText ?? 'Cancel'}
                </button>

                {!props.canNotDelete &&
                  (props.isLoading ? (
                    <div className='flex  h-10 min-w-20 justify-center px-2'>
                      <Loader size='16px' border='2px' />
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={props.confirmFunction}
                      className={`cursor-pointer
               inline-flex  min-w-20 justify-center rounded-md border border-transparent px-4 py-2 shadow-xs ${props.confirmButtonColor} transition-150-ease-in text-base 
              font-medium text-white ${props.confirmButtonHoverColor} focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${props.confirmButtonFocusColor} sm:text-sm
              `}
                    >
                      {props.confirmText}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ErrorModal;
