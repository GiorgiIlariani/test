import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useForm } from 'react-hook-form';
import { storeDerivedBudget } from 'services';

export const useMoveTermModal = (onSubmit: (budgetId: number) => void, projectId?: number) => {
  const formMethods = useForm<{
    budget_id: string;
    title?: string;
  }>();

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;

  const selectedBudgetId = watch('budget_id');
  const isCreatingNewScope = selectedBudgetId === 'create_new_scope';
  const newScopeName = watch('title');

  const isMoveButtonDisabled = (isCreatingNewScope && !newScopeName) || !selectedBudgetId;

  const handleFormSubmit = async (data: { budget_id: string; title?: string }) => {
    if (isCreatingNewScope && data.title && projectId) {
      const token = getCookie('token');
      try {
        const response = await storeDerivedBudget(token, projectId, data.title);
        onSubmit(response.budget_id);
      } catch (error) {
        toastGeneralError(error);
      }
    } else {
      onSubmit(parseInt(data.budget_id));
    }
  };

  const onFormSubmit = handleSubmit(handleFormSubmit);

  return { formMethods, errors, isCreatingNewScope, isMoveButtonDisabled, onFormSubmit };
};
