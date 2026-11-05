import type { ComponentPropsWithoutRef } from 'react';
import type { Input } from 'components';
import { BaseFormProps } from '../types';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  | 'aria-invalid'
  | 'className'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onKeyDown'
  | 'required'
  | 'value'
>;

export type FormTagsInputProps = BaseFormProps &
  NativeInputProps & {
    inputClassName?: string;
  };
