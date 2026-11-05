'use client';

import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { enhanceUserWithAiRequest, updateBriefIntro } from 'services';
import { SetState, ShowPageEmployee } from 'types';
import { Props } from './types';
import { useRouter } from 'next/router';
import axios from 'axios';

export const useBriefIntroModal = (
  employee: ShowPageEmployee,
  toggleModal: () => void,
  setValue: SetState<string>,
  refetch: () => void,
  form: Props['form'],
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oldData, setOldData] = useState({ brief_intro: employee.brief_intro });

  const router = useRouter();

  const handleSubmit = async (data: { brief_intro: string }) => {
    setIsLoading(true);
    const token = getCookie('token');

    try {
      await updateBriefIntro(token, employee.id, data);
      setValue(!data.brief_intro ? '' : data.brief_intro.trim());
      toggleModal();
      refetch();
    } catch (e: any) {
      setIsLoading(false);
      if (e?.message.includes('frontValidation')) return;
      if (!('response' in e)) return toastGeneralError(e, router);
      if (e.response?.status === 422)
        handleBackendErrors(e.response?.data.errors, form.setFocus, form.setError);
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceUserWithAi = async (additionalPrompt: string, controller?: AbortController) => {
    const data = form.getValues();
    setIsLoading(true);

    try {
      const response = await enhanceUserWithAiRequest(
        employee.id,
        getCookie('token'),
        { prompt: additionalPrompt, brief_intro: data.brief_intro },
        controller,
      );

      setOldData(data);

      form.setValue('brief_intro', response.brief_intro ?? '');

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (axios.isCancel(error)) {
        return { cancelled: true };
      } else {
        toastGeneralError(error, router);
      }
    }

    return { cancelled: false };
  };

  const undoAiHandler = () => {
    form.setValue('brief_intro', oldData.brief_intro ?? '');
  };

  return {
    getValues: form.getValues,
    handleSubmit,
    form,
    isLoading,
    enhanceUserWithAi,
    undoAiHandler,
  };
};
