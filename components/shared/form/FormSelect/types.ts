import type { ComponentPropsWithoutRef } from 'react';
import type { Select, SelectContent } from 'components';
import { BaseFormProps, Option } from '../types';

type NativeSelectProps = Omit<ComponentPropsWithoutRef<typeof SelectContent>, 'children'> &
  Omit<
    ComponentPropsWithoutRef<typeof Select>,
    | 'children'
    | 'defaultValue'
    | 'disabled'
    | 'id'
    | 'items'
    | 'multiple'
    | 'name'
    | 'onValueChange'
    | 'value'
  >;

export type FormSelectProps = BaseFormProps &
  NativeSelectProps & {
    items: Option[];
    placeholder?: string;
    onChangeHandler?: (value: Option['value']) => void;
    triggerClassName?: string;
    contentClassName?: string;
    alignItemWithTrigger?: boolean;
    chevronInheritsColor?: boolean;
    hideChevron?: boolean;
  };
