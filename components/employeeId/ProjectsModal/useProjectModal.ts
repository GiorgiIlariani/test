'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { enhanceUserWithAiRequest } from 'services';
import { Project, ShowPageEmployee } from 'types';

export const useProjectModal = (
  defaultValues: { projects: Project[] },
  employee: ShowPageEmployee,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const form = useForm({
    defaultValues: defaultValues.projects.length
      ? defaultValues
      : {
          projects: [
            {
              company: '',
              description: '',
              end_date: '',
              id: null,
              project_id: null,
              industry: null,
              responsibility: '',
              role: '',
              start_date: '',
              skills: [],
              title: '',
              file: '',
              media_link: '',
              is_currently_working: false,
              order: 1,
            },
          ],
        },
  });

  const [oldData, setOldData] = useState<Project[]>(
    JSON.parse(JSON.stringify(form.getValues().projects)),
  );

  const enhanceUserWithAi = async (
    additionalPrompt: string,
    controller?: AbortController,
    _?: string[],
    index?: number,
  ) => {
    const data: Project[] = JSON.parse(JSON.stringify(form.getValues().projects));
    setOldData(data);

    setIsLoading(true);

    try {
      const response = await enhanceUserWithAiRequest(
        employee.id,
        getCookie('token'),
        { prompt: additionalPrompt, projects: data },
        controller,
      );

      data.forEach((_, i) => {
        if (i === index) {
          const valueDesc =
            response.projects?.find((edu: any) => edu.originalIndex === index).description ?? '';
          form.setValue(`projects.${index}.description`, valueDesc);

          const valueResp =
            response.projects?.find((edu: any) => edu.originalIndex === index).responsibility ?? '';
          form.setValue(`projects.${index}.responsibility`, valueResp);
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
      projects: oldData.map((item) => ({
        ...item,
        description: item.description ?? '',
        responsibility: item.responsibility ?? '',
      })),
    });
  };

  return { form, enhanceUserWithAi, undoAiHandler };
};
