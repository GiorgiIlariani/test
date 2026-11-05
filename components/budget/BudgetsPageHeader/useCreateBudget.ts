import { PROJECT_TYPE } from 'config';
import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createBudget } from 'services';
import { Currency } from 'types';

export const useCreateBudget = (defaultCurrency: Currency) => {
  const router = useRouter();
  const [isBudgetCreationLoading, setIsBudgetCreationLoading] = useState(false);

  const createBudgetHandler = async () => {
    setIsBudgetCreationLoading(true);
    try {
      const response = await createBudget(getCookie('token'), {
        internal_project_id: null,
        title: '',
        rate_card_id: null,
        currency: defaultCurrency,
        project_title: '',
        owner_id: '',
        status: 'unpublished',
        selected_term: '',
        subtotal: '',
        description: '',
        are_public_holidays_counted: false,
        project_type: PROJECT_TYPE.DEFAULT,
      });
      analytics.track('Create budget button');
      const navigated = await router.push(`/create-budget?budgetId=${response.budget_id}`);
      if (!navigated) {
        setIsBudgetCreationLoading(false);
      }
    } catch (error) {
      setIsBudgetCreationLoading(false);
      toastGeneralError(error, router);
    }
  };

  return { createBudgetHandler, isBudgetCreationLoading };
};
