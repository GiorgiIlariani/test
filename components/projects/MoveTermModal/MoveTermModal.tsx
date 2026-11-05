import React from 'react';
import { Backdrop, NormalInput, RadioWithLabel } from 'components/shared';
import { FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useMoveTermModal } from './useMoveTermModal';

const MoveTermModal: React.FC<Props> = ({
  termName,
  budgets,
  onSubmit,
  onClose,
  title,
  submitText,
  projectId,
}) => {
  const { formMethods, onFormSubmit, isCreatingNewScope, isMoveButtonDisabled, errors } =
    useMoveTermModal(onSubmit, projectId);

  return (
    <div
      className='fixed inset-0 z-999999 overflow-y-auto'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0'>
        <Backdrop onClick={() => onClose()} />

        <div className='relative inline-block transform rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xs transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle'>
          {!!termName ? (
            <h2 className='text-lg font-semibold mb-2'>
              Where to move term <span className='text-indigo-600'>{termName}</span>?
            </h2>
          ) : (
            <h2 className='text-lg font-semibold mb-2'>{title}</h2>
          )}

          <FormProvider {...formMethods}>
            <form onSubmit={onFormSubmit} className='space-y-4'>
              <div className='space-y-2 overflow-y-auto max-h-104 px-2'>
                {budgets.map((budget) => (
                  <RadioWithLabel
                    key={budget.id}
                    inputName='budget_id'
                    label={budget.title}
                    value={budget.id?.toString() ?? '1'}
                    registerOptions={{
                      required: {
                        value: true,
                        message: 'Please select a budget',
                      },
                    }}
                  />
                ))}

                <RadioWithLabel
                  label='Create new scope'
                  inputName='budget_id'
                  value='create_new_scope'
                  registerOptions={{
                    required: {
                      value: true,
                      message: 'Please select a budget',
                    },
                  }}
                />

                {isCreatingNewScope && (
                  <NormalInput
                    inputName='title'
                    placeholder='New scope name'
                    registerOptions={{
                      required: 'Scope name is required',
                    }}
                    doNotLeavePlaceForError
                    autoFocus
                  />
                )}

                {errors.budget_id && (
                  <p className='text-sm text-red-500'>{errors.budget_id.message}</p>
                )}
              </div>

              <div className='flex justify-end gap-2 mt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-3 py-2 border border-zinc-200 rounded-md ml-auto hover:bg-gray-200 text-sm'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isMoveButtonDisabled}
                  className='px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 disabled:opacity-50 text-sm'
                >
                  {submitText ?? 'Move Term'}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default MoveTermModal;
