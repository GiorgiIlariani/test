import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ActionsModalWrapper, BasicSelect, NormalInput } from 'components';
import { Props } from './types';
import { validateThatDateIsSane } from 'helpers';
import { useRehireModal } from './useRehireModal';

const RehireModal: React.FC<Props> = (props) => {
  const { form, handleSubmit, loading } = useRehireModal(
    props.toggleModal,
    props.userId,
    props.setActionsAreAdded,
    props.refetchEmployees,
    props.defaultDate,
    props.isInBudgetView,
  );

  return (
    <FormProvider {...form}>
      <ActionsModalWrapper
        title='Rehire'
        submitButtonText='Save'
        submitButtonHandler={handleSubmit}
        secondaryButtonText='Previous'
        secondaryButtonHandler={props.toggleModal}
        onClose={props.toggleModal}
        loading={loading}
      >
        <div className='p-6'>
          <div className='grid grid-cols-2 gap-4'>
            <NormalInput
              inputName='date'
              labelName='Start date *'
              placeholder='Start date'
              type='date'
              labelClasses='text-slate-900!'
              registerOptions={{
                required: {
                  message: 'Start date day is required',
                  value: true,
                },
                validate: {
                  dateIsSane: (v) => validateThatDateIsSane(v),
                  compareJoinDate: (v) =>
                    new Date(v) >= new Date(props.joinDate) ||
                    `Rehire date should not be earlier than join date`,
                },
              }}
              doNotLeavePlaceForError
            />
            <BasicSelect
              inputName='status'
              labelName='Status *'
              list={['active', 'draft']}
              inputClassName='capitalize'
              dropDownStyles='top-[4.5rem]'
              noSearch
              doNotLeavePlaceForError
            />
          </div>
        </div>
      </ActionsModalWrapper>
    </FormProvider>
  );
};

export default RehireModal;
