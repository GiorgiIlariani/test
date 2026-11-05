import type { ComponentPropsWithoutRef } from 'react';
import type { ComboboxInput } from 'components';
import { BaseFormProps, GroupedOption } from '../types';

type NativeComboboxInputProps = Omit<
  ComponentPropsWithoutRef<typeof ComboboxInput>,
  | 'aria-invalid'
  | 'children'
  | 'className'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onChange'
  | 'render'
  | 'required'
  | 'value'
>;

export type FormGroupedComboboxProps = BaseFormProps &
  NativeComboboxInputProps & {
    items: GroupedOption[];
  };
