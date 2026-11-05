import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import type { InputGroupInput } from 'components';
import { BaseFormProps } from '../types';

type NativeSalaryInputProps = Omit<
  ComponentPropsWithoutRef<typeof InputGroupInput>,
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

export type FormSalaryInputProps = BaseFormProps &
  NativeSalaryInputProps & {
    currencyName: string;
    hideCurrencySelect?: boolean;
    currencyTriggerClassName?: string;
    currencyContentClassName?: string;
    externalOnChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  };
