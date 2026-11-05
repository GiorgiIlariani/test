import { BasicSelect, NormalInput, RadioWithLabel } from 'components';
import { validateThatDateIsSane } from 'helpers';
import React from 'react';
import { Props } from './types';
import { useTerminationShowModal } from './useTerminationShowModal';

const TerminationShowModal: React.FC<Props> = (props) => {
  const {
    setCompensationTillDate,
    register,
    compensationTill,
    setCompensationTill,
    isTerminationNotVoluntary,
    compensationEnabled,
    setCompensationEnabled,
  } = useTerminationShowModal(props.logDetailedInfo);

  return (
    <div>
      <div className='w-[calc(50%-0.5rem)]'>
        <BasicSelect
          inputName='status'
          labelName='Status *'
          list={['active', 'draft']}
          inputClassName='capitalize'
          dropDownStyles='top-[4.5rem]'
          canNotEdit={!props.logIsInEditMode}
          noSearch
        />
      </div>
      <div className='w-[calc(50%-0.5rem)]'>
        <NormalInput
          inputName='date'
          labelName='Last working day'
          placeholder='Last working day'
          type='date'
          labelClasses='text-slate-900!'
          canNotEdit={!props.logIsInEditMode}
          disabledClasses={'disabled:bg-gray-100 text-gray-600'}
          registerOptions={{
            required: {
              message: 'Last working day is required',
              value: true,
            },
            validate: (v) => validateThatDateIsSane(v),
          }}
          OnDateChange={(value) =>
            value && setCompensationTillDate(value?.toLocaleDateString('en-CA'))
          }
        />
      </div>
      <span className='text-slate-900 text-left block'>Termination Initiative</span>
      <div className='flex space-x-4'>
        <RadioWithLabel
          inputName='meta.voluntarity'
          label='Voluntary'
          value='voluntarily'
          wrapperClasses='w-auto!'
          canNotEdit={!props.logIsInEditMode}
        />
        <RadioWithLabel
          inputName='meta.voluntarity'
          label='Involuntary'
          value='involuntarily'
          wrapperClasses='w-auto!'
          canNotEdit={!props.logIsInEditMode}
          externalChangeHandler={(e) => {
            if ((e?.target as HTMLInputElement).value === 'involuntarily') {
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
      {isTerminationNotVoluntary && (
        <>
          <div className='flex items-center gap-2 pt-4'>
            <input
              type='checkbox'
              disabled={!props.logIsInEditMode}
              className={!props.logIsInEditMode ? 'bg-slate-900/20' : ''}
              {...register('meta.compensation_enabled')}
              onChange={(e) => setCompensationTill(e.target.checked)}
              defaultChecked={compensationEnabled}
            />
            <p className='text-sm font-medium'>Compensation enabled</p>
          </div>
        </>
      )}

      {compensationTill && isTerminationNotVoluntary && (
        <div className='w-[calc(50%-0.5rem)]'>
          <NormalInput
            inputName='meta.compensation_till'
            labelName='Compensated till'
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
            canNotEdit={!props.logIsInEditMode}
          />
        </div>
      )}

      <div className='w-[calc(50%-0.5rem)] mt-2'>
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
          errorIconStyles='mt-1!'
          canNotEdit={!props.logIsInEditMode}
        />
      </div>
      <span className='text-slate-900 text-left block'>Would you like to rehire</span>
      <div className='flex space-x-4'>
        <RadioWithLabel
          inputName='meta.would_rehire'
          label='Yes'
          value='yes'
          wrapperClasses='w-auto!'
          canNotEdit={!props.logIsInEditMode}
        />
        <RadioWithLabel
          inputName='meta.would_rehire'
          label='No'
          value='no'
          wrapperClasses='w-auto!'
          canNotEdit={!props.logIsInEditMode}
        />
      </div>
    </div>
  );
};

export default TerminationShowModal;
