import { Props } from './types';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { RadioWithLabel, NormalInput, DeleteX, Backdrop, PortalWrapper } from 'components';
import { ErrorMessage } from '@hookform/error-message';
import { useSaveFilterModal } from './useSaveFilterModal';
import { capitalizeErrorMessage } from 'helpers';

const SaveFilterModal: React.FC<Props> = (props) => {
  const { form, errors, isLoading, submitHandler } = useSaveFilterModal(
    props.filterOptions,
    props.setFilterIsSaved,
    props.closeHandler,
    props.setSavedFiltersState,
  );
  return (
    <PortalWrapper>
      <div
        className='fixed inset-0 z-999999 overflow-y-auto'
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div className=' min-h-screen items-start mt-20 justify-center flex  '>
          <Backdrop onClick={props.closeHandler} />

          <span className='hidden sm:inline-block sm:h-screen sm:align-middle' aria-hidden='true'>
            &#8203;
          </span>

          <div className='relative inline-block transform overflow-hidden rounded-lg bg-white w-full max-w-sm pt-4'>
            <div className='flex items-center px-4 justify-between'>
              <h1 className='text-slate-900 font-bold'>Save filter</h1>
              <button className='p-1 rounded-full hover:bg-gray-200' onClick={props.closeHandler}>
                {' '}
                <DeleteX />
              </button>
            </div>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className='px-4 mt-4'>
                  <NormalInput
                    inputName='name'
                    labelName='Filter name'
                    placeholder='Enter filter name'
                    type='text'
                    registerOptions={{
                      required: {
                        message: 'Filter name is required',
                        value: true,
                      },
                    }}
                  />
                  <span className='my-2 text-left font-medium text-gray-700'>Type</span>
                  <div className='flex space-x-6 items-center'>
                    <RadioWithLabel
                      inputName='is_private'
                      label='Public'
                      wrapperClasses='w-fit'
                      value={'no'}
                    />
                    <RadioWithLabel inputName='is_private' label='Private' value={'yes'} />
                  </div>
                  <div className='h-6 min-h-4 text-left text-xs  text-red-500'>
                    <ErrorMessage
                      render={capitalizeErrorMessage}
                      name='is_private'
                      errors={errors}
                    />
                  </div>
                </div>
                <div className='px-4 text-sm font-medium py-3  border-t border-gray-100 flex items-center justify-end space-x-4'>
                  <button
                    type='button'
                    onClick={props.closeHandler}
                    className='text-slate-900 px-3 py-2 border transition hover:bg-gray-200 border-zinc-200 rounded-md'
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    className=' text-center gap-2 text-white hover:bg-indigo-800 w-14 py-2 border transition rounded-md bg-indigo-600'
                  >
                    Save
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </PortalWrapper>
  );
};

export default SaveFilterModal;
