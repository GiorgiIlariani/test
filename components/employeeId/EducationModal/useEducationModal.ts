'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { enhanceUserWithAiRequest } from 'services';
import { Education, ShowPageEmployee } from 'types';

export const useEducationModal = (
  defaultValues: { education: Education[] },
  employee: ShowPageEmployee,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const form = useForm({
    defaultValues: defaultValues.education.length
      ? defaultValues
      : {
          education: [
            {
              degree: '',
              faculty: '',
              finish_date: '',
              id: undefined,
              education_id: '',
              start_date: '',
              university: '',
              description: '',
              current: false,
              order: 1,
            },
          ],
        },
    mode: 'onBlur',
    shouldFocusError: true,
  });

  const [oldData, setOldData] = useState<Education[]>(
    JSON.parse(JSON.stringify(form.getValues().education)),
  );

  const enhanceUserWithAi = async (
    additionalPrompt: string,
    controller?: AbortController,
    _?: string[],
    index?: number,
  ) => {
    const data: Education[] = JSON.parse(JSON.stringify(form.getValues().education));
    setOldData(data);

    setIsLoading(true);

    try {
      const response = await enhanceUserWithAiRequest(
        employee.id,
        getCookie('token'),
        { prompt: additionalPrompt, education: data },
        controller,
      );

      data.forEach((_, i) => {
        if (i === index) {
          const value =
            response.education?.find((edu: any) => edu.originalIndex === index).description ?? '';
          form.setValue(`education.${index}.description`, value);
        }
      });

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (axios.isCancel(error)) {
        return { cancelled: true };
      } else {
        toastGeneralError(error);
      }
    }

    return { cancelled: false };
  };

  const undoAiHandler = () => {
    form.reset({
      education: oldData.map((item) => ({
        ...item,
        description: item.description ?? '',
      })),
    });
  };

  return { form, enhanceUserWithAi, undoAiHandler };
};
