import type { ComponentPropsWithoutRef } from 'react';
import type { DatePicker } from 'components';
import { BaseFormProps } from '../types';

type NativeDatePickerProps = Omit<
  ComponentPropsWithoutRef<typeof DatePicker>,
  'aria-invalid' | 'date' | 'disabled' | 'id' | 'onSelect' | 'required'
>;

export type FormDatePickerProps = BaseFormProps &
  NativeDatePickerProps & {
    onSelect?: (date?: Date) => void;
  };
