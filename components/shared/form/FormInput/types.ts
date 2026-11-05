import type { ComponentPropsWithoutRef } from 'react';
import type { Input } from 'components';
import { BaseFormProps } from '../types';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  | 'aria-invalid'
  | 'className'
  | 'defaultValue'
  | 'disabled'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'required'
  | 'value'
>;

export type FormInputProps = BaseFormProps &
  NativeInputProps & {
    inputClassName?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
