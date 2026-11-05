import { useForm } from 'react-hook-form';
import { ConfigFieldModalArgs, FormValues } from './types';

export const useConfigFieldModal = ({
  initialValue = '',
  initialEnabled = false,
  submitting = false,
  onClose,
  onSubmit,
}: ConfigFieldModalArgs) => {
  const form = useForm<FormValues>({
    defaultValues: { title: initialValue, enabled: initialEnabled },
  });

  const handleSubmit = async ({ title: value, enabled }: FormValues) => {
    if (submitting) return;

    const message = await onSubmit({ title: value.trim(), enabled });
    if (message) form.setError('title', { type: 'server', message });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting || nextOpen) return;
    onClose();
  };

  return { form, handleSubmit, handleOpenChange };
};
