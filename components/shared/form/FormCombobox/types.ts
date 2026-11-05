import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { ComboboxInput } from 'components';
import { BaseFormProps, Option } from '../types';
import { type ComboboxRoot } from '@base-ui/react';

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

export type FormComboboxProps = BaseFormProps &
  NativeComboboxInputProps & {
    items: Option[];
    emptyText?: string;
    creatable?: boolean;
    inputValue?: string;
    isLoading?: boolean;
    inputClassName?: string;
    inputWrapperClassName?: string;
    contentClassName?: string;
    onCreateClick?: (inputValue: string, event: MouseEvent<HTMLButtonElement>) => void;
    onValueChange?: (value: Option | null, eventDetails: ComboboxRoot.ChangeEventDetails) => void;
    onInputValueChange?: (
      inputValue: string,
      eventDetails: ComboboxRoot.ChangeEventDetails,
    ) => void;
  };
