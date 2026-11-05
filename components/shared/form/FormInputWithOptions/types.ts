import type { ComponentPropsWithoutRef } from 'react';
import type { Input } from 'components';
import { BaseFormProps, Option } from '../types';

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

export type FormInputWithOptionsProps = BaseFormProps &
  NativeInputProps & {
    inputClassName?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    options: Option[];
    optionName: string;
    optionsTriggerClassName?: string;
    optionsContentClassName?: string;
  };
