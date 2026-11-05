'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';

import { useContext, useEffect, useState } from 'react';
import { UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { createIndustry } from 'services';
import { Project, SetState } from 'types';
import { Props } from './types';

export const useProject = (
  remove: UseFieldArrayRemove,
  index: number,
  id: number,
  setRemovedItems: SetState<number[]>,
  industriesData: Props['industries'],
) => {
  const { setValue, getValues } = useFormContext();
  const { skills } = useContext(GlobalApiInfo);

  const deleteProjectHandler = (i: number) => {
    const newState: Project[] = [...getValues('projects')];
    newState.splice(i, 1);
    remove(i);
    id && setRemovedItems?.((prev) => prev.concat(+id!));
    setValue('projects', newState, {
      shouldDirty: true,
    });
  };

  const [industries, setIndustries] =
    useState<{ id: number; title: string; name: string }[]>(industriesData);
  const [newData, setNewData] = useState<{ id: number; title: string; name: string } | null>(null);

  const createIndustryHandler = async (name: string) => {
    try {
      const list = industries?.length ? industries : industriesData;
      const exists = list?.some((el) => el.title === name);
      if (!exists) {
        const response = await createIndustry(getCookie('token'), { name });

        const createdIndustry = {
          id: response.data?.industry?.id,
          title: response.data?.industry?.name,
          name: response.data?.industry?.name,
        };

        setNewData(createdIndustry);

        setValue(`projects.${index}.industry.name`, createdIndustry.name);
        setValue(`projects.${index}.industry_id`, createdIndustry.id, { shouldDirty: true });
      }
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    if (newData) {
      setIndustries((prev) => [...(prev.length ? prev : industriesData), newData]);
    } else {
      setIndustries(industriesData);
    }
  }, [newData]);

  const current = useWatch({ name: `projects.${index}.is_currently_working` });
  const endDate = useWatch({ name: `projects.${index}.end_date` });
  const startDate = useWatch({ name: `projects.${index}.start_date` });

  return {
    deleteProjectHandler,
    skills,
    getValues,
    current,
    endDate,
    setValue,
    startDate,
    createIndustryHandler,
    industries,
  };
};
