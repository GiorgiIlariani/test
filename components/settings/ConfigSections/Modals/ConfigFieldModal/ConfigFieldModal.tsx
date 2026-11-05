import { FieldTitle, FormInput, Modal, Switch } from 'components';
import { Controller, FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useConfigFieldModal } from './useConfigFieldModal';

const ConfigFieldModal = ({
  title,
  description = 'Keep your workspace configuration consistent and easy to understand.',
  fieldLabel,
  initialValue = '',
  initialEnabled = false,
  toggle,
  requiredMessage = 'Enter a name.',
  submitLabel = 'Save changes',
  submitting = false,
  onClose,
  onSubmit,
}: Props) => {
  const { form, handleSubmit, handleOpenChange } = useConfigFieldModal({
    initialValue,
    initialEnabled,
    submitting,
    onClose,
    onSubmit,
  });

  const submit = form.handleSubmit(handleSubmit);

  return (
    <Modal
      open
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      submitting={submitting}
      closeButtonText='Cancel'
      confirmButtonText={submitLabel}
      confirmButtonTextSubmitting='Saving...'
      contentClassName='max-w-lg'
      onConfirm={submit}
    >
      <FormProvider {...form}>
        <form noValidate onSubmit={submit}>
          <FormInput
            name='title'
            label={fieldLabel}
            autoFocus
            disabled={submitting}
            wrapperClassName='gap-2'
            labelClassName='text-sm font-medium'
            inputClassName='h-11 px-3'
            rules={{
              validate: (value) => value.trim().length > 0 || requiredMessage,
            }}
          />

          {toggle && (
            <div className='mt-6'>
              <div className='flex items-center justify-between gap-4'>
                <FieldTitle className='font-semibold'>{toggle.label}</FieldTitle>
                <Controller
                  name='enabled'
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={submitting}
                      aria-label={toggle.label}
                    />
                  )}
                />
              </div>
              <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
                {toggle.description}
              </p>
            </div>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
};

export default ConfigFieldModal;
