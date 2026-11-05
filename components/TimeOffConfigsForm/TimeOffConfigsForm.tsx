import {
  ApplicationConfigsCTAButtons,
  Field,
  FieldLabel,
  FormCombobox,
  FormInput,
  Input,
} from 'components';
import { Props } from './types';
import { FormProvider } from 'react-hook-form';
import { useTimeOffConfigsForm } from './useTimeOffConfigsForm';

const TimeOffConfigsForm = (props: Props) => {
  const { form, reset, submitting, onSubmit, handleSubmit, isTrialPeriodEnabled, isDirty } =
    useTimeOffConfigsForm(props.timeOffConfig);

  return (
    <FormProvider {...form}>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-6'>
            <FormCombobox
              name='final_reviewer'
              label='Final approver'
              placeholder='John Doe'
              emptyText='Employee not found.'
              items={props.employees.map((employee) => ({
                value: employee.id,
                label: employee.name!,
              }))}
              rules={{
                required: 'Final approver is required.',
              }}
              info='The person you select here will have the ultimate authority to approve or deny time off requests. We refer to this role as the "Gandalf" of time offs.'
              required
            />

            <FormInput
              name='yearly_vacation_days'
              label='Vacation days in a year'
              placeholder='24'
              type='number'
              rules={{
                required: 'Vacation days are required.',
                min: { value: 1, message: 'Vacation days must be at least 1.' },
                max: { value: 365, message: 'Vacation days must be at most 365.' },
              }}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name='trial_period'
              label='Trial period'
              placeholder='11'
              type='number'
              rules={{
                min: { value: 0, message: 'Trial period must be at least 0.' },
                max: { value: 100, message: 'Trial period must be at most 100.' },
              }}
              info='If newly hired employees in your organization don’t immediately have access to paid vacations, specify the number of months before they become eligible to receive vacation days.'
            />

            {isTrialPeriodEnabled ? (
              <FormInput
                name='trial_bonus_days'
                label='Trial period bonus days'
                placeholder='5'
                type='number'
                rules={{
                  min: { value: 0, message: 'Trial period bonus must be at least 0.' },
                  max: { value: 365, message: 'Trial period bonus must be at most 365.' },
                }}
              />
            ) : (
              <Field data-disabled>
                <FieldLabel>Trial period bonus days</FieldLabel>
                <Input value='N/A' type='text' disabled />
              </Field>
            )}
          </div>
        </div>

        <ApplicationConfigsCTAButtons
          cancelDisabled={submitting || !isDirty}
          saveDisabled={submitting || !isDirty}
          onCancelClick={() => reset()}
          submitting={submitting}
        />
      </form>
    </FormProvider>
  );
};

export default TimeOffConfigsForm;
