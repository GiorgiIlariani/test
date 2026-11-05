'use client';

import { FormEvent, useState } from 'react';
import { Props } from './types';

export const useEditableTableCell = (props: Props) => {
  const [value, setValue] = useState<number>(props.value || 0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(true);
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setValue(+sanitizedValue);
    props.setValue?.(+sanitizedValue);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await props.onSubmit();
    setIsActive(false);
  };

  const handleCancel = () => {
    setIsActive(false);
    setValue(props.value || 0);
    props.setValue?.(props.value || 0);
  };

  return { handleChange, handleSubmit, value, isActive, handleCancel };
};
