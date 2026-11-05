import React from 'react';
import { FormProvider } from 'react-hook-form';
import { AdvancedSelect, Backdrop, NormalInput } from 'components/shared';
import { ActionChoiceCheckbox } from 'components/employeeId';
import { Props } from './types';
import { useChangeScopeModal } from './useChangeScopeModal';

const ChangeScopeModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  currentPhases,
  availableScopes,
  projectId,
}) => {
  const { formMethods, isCreatingNewScope, createNewScopeId, isSubmitDisabled, onFormSubmit } =
    useChangeScopeModal(availableScopes, currentPhases, onSubmit, projectId);

  return (
    <div className='fixed inset-0 z-999999 overflow-y-auto' role='dialog' aria-modal='true'>
      <div className='flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0'>
        <Backdrop onClick={onClose} />

        <div className='relative inline-block transform rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xs transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle'>
          <h2 className='text-lg font-semibold mb-2'>Change Scope for All Phases</h2>

          <FormProvider {...formMethods}>
            <form onSubmit={onFormSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <p className='font-medium text-zinc-700'>Phases in current scope:</p>
                {currentPhases.map((phase) => (
                  <ActionChoiceCheckbox
                    key={phase.id}
                    label={phase.name}
                    name='phase_ids'
                    value={phase.id?.toString() ?? '1'}
                    useManualLabelClickHandler={currentPhases.length > 1}
                  />
                ))}
              </div>

              <AdvancedSelect
                inputName='new_scope'
                labelName='Move to scope *'
                list={[...availableScopes, { id: createNewScopeId, title: 'Create new scope' }]}
                placeholder='Choose new scope'
                registerOptions={{
                  required: 'Scope is required',
                }}
                noSearch
                inputClassName='py-[7px]! capitalize'
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

              <div className='flex justify-end gap-2 mt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-3 py-2 border border-zinc-200 rounded-md hover:bg-gray-200 text-sm'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitDisabled}
                  className='px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 disabled:opacity-50 text-sm'
                >
                  Save changes
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ChangeScopeModal;
