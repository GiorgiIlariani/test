import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { ComboboxChipsInput } from 'components';
import { BaseFormProps } from '../types';
import { type ComboboxRoot } from '@base-ui/react';

type NativeComboboxInputProps = Omit<
  ComponentPropsWithoutRef<typeof ComboboxChipsInput>,
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

export type FormMultipleComboboxProps<T = any> = BaseFormProps &
  NativeComboboxInputProps & {
    items: T[];
    itemToLabel?: (item: T) => string;
    itemToValue?: (item: T) => string | number;
    emptyText?: string;
    creatable?: boolean;
    inputValue?: string;
    isLoading?: boolean;
    inputClassName?: string;
    contentClassName?: string;
    onCreateClick?: (inputValue: string, event: MouseEvent<HTMLButtonElement>) => void;
    onValueChange?: (value: T[], eventDetails: ComboboxRoot.ChangeEventDetails) => void;
    onInputValueChange?: (
      inputValue: string,
      eventDetails: ComboboxRoot.ChangeEventDetails,
    ) => void;
  };
