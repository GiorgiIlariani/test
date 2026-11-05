import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ActionsModalWrapper, BasicSelect, NormalInput, RadioWithLabel } from 'components';
import { Props } from './types';
import { useTerminateModal } from './useTerminateModal';
import {
  capitalizeErrorMessage,
  validateRequiredFieldForBlank,
  validateThatDateIsSane,
} from 'helpers';
import { ErrorMessage } from '@hookform/error-message';

const TerminateModal: React.FC<Props> = (props) => {
  const {
    form,
    handleSubmit,
    loading,
    isTerminationNotVoluntary,
    setCompensationTillDate,
    compensationEnabled,
    compensationTill,
    setCompensationTill,
    setCompensationEnabled,
  } = useTerminateModal(
    props.toggleModal,
    props.userId,
    props.setActionsAreAdded,
    props.setCanNotTerminate,
    props.setUserProjectsInfo,
    props.refetchEmployees,
    props.defaultDate,
    props.isInBudgetView,
  );
  const { errors } = form.formState;

  return (
    <FormProvider {...form}>
      <ActionsModalWrapper
        title='Termination'
        secondaryButtonText={props.previousButtonText ?? 'Cancel'}
        secondaryButtonHandler={props.previousStepHandler ?? props.toggleModal}
        submitButtonText='Save'
        submitButtonHandler={handleSubmit}
        onClose={props.toggleModal}
        loading={loading}
        titleSuffix={props.titleSuffix}
      >
        <div className='p-6 flex flex-col gap-4'>
          <div className='w-[calc(50%-0.5rem)]'>
            <BasicSelect
              inputName='status'
              labelName='Status *'
              list={['active', 'draft']}
              inputClassName='capitalize'
              dropDownStyles='top-[4.5rem]'
              noSearch
              removeErrorMessage
            />
          </div>

          <div className='w-[calc(50%-0.5rem)]'>
            <NormalInput
              inputName='date'
              labelName='Last working day *'
              placeholder='Start date'
              type='date'
              labelClasses='text-slate-900!'
              registerOptions={{
                required: {
                  message: 'Last working day is required',
                  value: true,
                },
                validate: {
                  dateIsSane: (v) => validateThatDateIsSane(v),
                  compareJoinDate: (v) =>
                    new Date(v) >= new Date(props.joinDate) ||
                    `Leave date should not be earlier than join date`,
                },
              }}
              OnDateChange={(date) => {
                if (!date) return;

                setCompensationTillDate(date.toLocaleDateString('en-CA'));
                form.clearErrors('meta.compensation_till');
              }}
              doNotLeavePlaceForError
            />
          </div>

          <div>
            <span className='text-slate-900 text-left block text-sm'>Termination Initiative *</span>
            <div className='flex space-x-4'>
              <RadioWithLabel
                inputName='meta.voluntarity'
                label='Voluntary'
                value='voluntarily'
                wrapperClasses='w-auto!'
                registerOptions={{
                  required: {
                    message: 'Termination Initiative is required',
                    value: true,
                  },
                  shouldUnregister: true,
                }}
              />

              <RadioWithLabel
                inputName='meta.voluntarity'
                label='Involuntary'
                value='involuntarily'
                wrapperClasses='w-auto!'
                registerOptions={{
                  required: {
                    message: 'Termination Initiative is required',
                    value: true,
                  },
                  shouldUnregister: true,
                }}
                externalChangeHandler={(e) => {
                  if (e?.target.value === 'involuntarily') {
                    {
                      setCompensationEnabled(true);
                      setCompensationTill(true);
                    }
                  } else {
                    setCompensationTill(false);
                  }
                }}
              />
            </div>

            {errors.meta?.voluntarity && (
              <div className='text-left text-2xs text-red-500 min-h-5'>
                <ErrorMessage
                  render={capitalizeErrorMessage}
                  name='meta.voluntarity'
                  errors={errors}
                />
              </div>
            )}
          </div>

          {isTerminationNotVoluntary && (
            <>
              <div className='flex items-center gap-2 pb-1'>
                <input
                  type='checkbox'
                  {...form.register('meta.compensation_enabled')}
                  onChange={(e) => setCompensationTill(e.target.checked)}
                  defaultChecked={compensationEnabled}
                />
                <p className='text-sm font-medium'>Compensation enabled</p>
              </div>
            </>
          )}

          {compensationTill && (
            <div className='w-[calc(50%-0.5rem)]'>
              <NormalInput
                inputName='meta.compensation_till'
                labelName='Compensated till *'
                placeholder='Compensated till'
                type='date'
                labelClasses='text-slate-900!'
                registerOptions={{
                  required: {
                    message: 'Compensated till is required',
                    value: true,
                  },
                  validate: (v) => validateThatDateIsSane(v),
                }}
                doNotLeavePlaceForError
              />
            </div>
          )}

          <div className='w-[calc(50%-0.5rem)]'>
            <BasicSelect
              inputName={'meta.reason'}
              labelName='Termination reason *'
              list={[
                'Better career opportunity',
                'Personal reasons',
                'Low performance',
                'Gross misconduct',
                'Reorganization',
                'Mutual agree',
                'Other',
              ]}
              placeholder='Enter termination reason'
              registerOptions={{
                required: {
                  message: 'Termination reason is required',
                  value: true,
                },
                validate: (value) => {
                  return validateRequiredFieldForBlank(value, 'Reason');
                },
              }}
              errorIconStyles='mt-1!'
              doNotLeavePlaceForError
            />
          </div>

          <div>
            <span className='text-slate-900 text-left block text-sm'>
              Would you like to rehire *
            </span>
            <div className='flex space-x-4'>
              <RadioWithLabel
                inputName='meta.would_rehire'
                label='Yes'
                value='yes'
                wrapperClasses='w-auto!'
                registerOptions={{
                  required: {
                    message: 'Rehire is required',
                    value: true,
                  },
                  shouldUnregister: true,
                }}
              />

              <RadioWithLabel
                inputName='meta.would_rehire'
                label='No'
                value='false'
                wrapperClasses='w-auto!'
                registerOptions={{
                  required: {
                    message: 'Rehire is required',
                    value: true,
                  },
                  shouldUnregister: true,
                }}
              />
            </div>

            {errors.meta?.would_rehire && (
              <div className='text-left text-2xs text-red-500 min-h-5'>
                <ErrorMessage
                  render={capitalizeErrorMessage}
                  name='meta.would_rehire'
                  errors={errors}
                />
              </div>
            )}
          </div>
        </div>
      </ActionsModalWrapper>
    </FormProvider>
  );
};

export default TerminateModal;
