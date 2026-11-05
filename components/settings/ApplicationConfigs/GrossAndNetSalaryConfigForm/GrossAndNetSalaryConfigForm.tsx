import { ApplicationConfigsCTAButtons, FormInput } from 'components';
import { FormProvider } from 'react-hook-form';
import { GrossAndNetSalaryConfigFormProps } from './types';
import { useGrossAndNetSalaryConfigForm } from './useGrossAndNetSalaryConfigForm';

const GrossAndNetSalaryConfigForm: React.FC<GrossAndNetSalaryConfigFormProps> = ({
  grossToNetMultiplier,
}) => {
  const { form, isDirty, handleSubmit, onSubmit, reset, submitting } =
    useGrossAndNetSalaryConfigForm(grossToNetMultiplier);

  return (
    <FormProvider {...form}>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          name='gross_to_net_multiplier'
          label='Gross to net multiplier'
          description='Used to calculate net salary from gross salary. Example: 1500 x 0.784 = 1176.'
          placeholder='0.784'
          type='number'
          step='0.001'
          rules={{
            required: 'Gross to net multiplier is required.',
            min: { value: 0, message: 'Gross to net multiplier must be at least 0.' },
            max: { value: 1, message: 'Gross to net multiplier must be at most 1.' },
            validate: (value) => {
              const stringValue = String(value);

              return (
                (!stringValue.toLowerCase().includes('e') &&
                  (stringValue.split('.')[1]?.length ?? 0) <= 3) ||
                'Gross to net multiplier must have at most 3 decimal places.'
              );
            },
          }}
          required
        />

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

export default GrossAndNetSalaryConfigForm;
