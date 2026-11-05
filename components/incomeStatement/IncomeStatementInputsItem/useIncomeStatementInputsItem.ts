'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useIncomeStatementInputsItem = (index: number, isOtherAdmin: boolean) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const { getValues } = useFormContext();

  const canDelete =
    isDeleteHovered &&
    getValues(`third_party_services.${index}.id`) &&
    (isOtherAdmin ? getValues(`third_party_services.${index}.department_id`) : true);
  return { getValues, isDeleteHovered, setIsDeleteHovered, canDelete };
};
