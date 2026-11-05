'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { enhanceUserWithAiRequest } from 'services';
import { Experiences, ShowPageEmployee } from 'types';

export const useExpirienceModal = (
  defaultValues: { experiences: Experiences[] },
  employee: ShowPageEmployee,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const form = useForm({
    defaultValues: defaultValues.experiences.length
      ? defaultValues
      : {
          experiences: [
            {
              company: '',
              description: '',
              current: false,
              end_date: '',
              start_date: '',
              id: null,
              experience_id: null,
              position: '',
              location: '',
              industry_id: null,
              employment_type_id: null,
              order: 1,
            },
          ],
        },
    mode: 'onBlur',
  });

  const [oldData, setOldData] = useState<Experiences[]>(
    JSON.parse(JSON.stringify(form.getValues().experiences)),
  );

  const enhanceUserWithAi = async (
    additionalPrompt: string,
    controller?: AbortController,
    _?: string[],
    index?: number,
  ) => {
    const data: Experiences[] = JSON.parse(JSON.stringify(form.getValues().experiences));
    setOldData(data);

    setIsLoading(true);

    try {
      const response = await enhanceUserWithAiRequest(
        employee.id,
        getCookie('token'),
        { prompt: additionalPrompt, experiences: data },
        controller,
      );

      data.forEach((_, i) => {
        if (i === index) {
          const value =
            response.experiences?.find((edu: any) => edu.originalIndex === index).description ?? '';
          form.setValue(`experiences.${index}.description`, value);
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
      experiences: oldData.map((item) => ({
        ...item,
        description: item.description ?? '',
      })),
    });
  };

  return { form, enhanceUserWithAi, undoAiHandler };
};
