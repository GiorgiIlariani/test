import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useForm } from 'react-hook-form';
import { storeDerivedBudget } from 'services';

export const useChangeScopeModal = (
  availableScopes: { id: number; title: string }[],
  currentPhases: { id: number | null; name: string }[],
  onSubmit: (newScope: string, affectedPhaseIds: number[]) => void,
  projectId?: number,
) => {
  const maxId = Math.max(...availableScopes.map((scope) => scope.id));
  const createNewScopeId = maxId + 1;

  const formMethods = useForm<{
    phase_ids: string[];
    new_scope: string;
    title?: string;
  }>({
    mode: 'onSubmit',
    defaultValues: {
      phase_ids: currentPhases.map((phase) => `${phase.id}`),
      new_scope: availableScopes[0]?.id.toString() ?? createNewScopeId.toString(),
    },
  });

  const { handleSubmit, watch } = formMethods;

  const selectedPhases = watch('phase_ids');
  const selectedScope = watch('new_scope');
  const newScopeName = watch('title');
  const isCreatingNewScope = +selectedScope === +createNewScopeId;

  const isSubmitDisabled =
    !selectedScope ||
    !selectedPhases ||
    selectedPhases.length === 0 ||
    (isCreatingNewScope && !newScopeName);

  const handleFormSubmit = async (data: {
    phase_ids: string | string[];
    new_scope: string;
    title?: string;
  }) => {
    const idsArray = Array.isArray(data.phase_ids) ? data.phase_ids : [data.phase_ids];
    const ids = idsArray.map((id) => parseInt(id));

    if (isCreatingNewScope && projectId && data.title) {
      const token = getCookie('token');
      try {
        const response = await storeDerivedBudget(token, projectId, data.title);
        onSubmit(response.budget_id, ids);
      } catch (error) {
        toastGeneralError(error);
      }
    } else {
      onSubmit(data.new_scope, ids);
    }
  };

  const onFormSubmit = handleSubmit(handleFormSubmit);

  return { formMethods, isCreatingNewScope, createNewScopeId, isSubmitDisabled, onFormSubmit };
};
