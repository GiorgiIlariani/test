import type { ComponentPropsWithoutRef } from 'react';
import type { Input, InputGroupAddon } from 'components';
import { BaseFormProps } from '../types';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  | 'aria-invalid'
  | 'className'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'required'
  | 'value'
>;

export type FormInputGroupProps = BaseFormProps &
  NativeInputProps & {
    inputClassName?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    alignIcon?: ComponentPropsWithoutRef<typeof InputGroupAddon>['align'];
    onIconClick?: () => void;
  };
