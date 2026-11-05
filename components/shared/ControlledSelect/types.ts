import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Select } from '../Select';

type ControlledSelectOption = {
  label: string;
  value: string | number;
};

type SelectRootProps = Omit<
  ComponentPropsWithoutRef<typeof Select>,
  'children' | 'defaultValue' | 'items' | 'onValueChange' | 'value'
>;

export type ControlledSelectProps = SelectRootProps & {
  items: ControlledSelectOption[];
  value: ControlledSelectOption['value'] | null;
  onValueChange: (value: ControlledSelectOption['value']) => void;
  placeholder?: string;
  renderValue?: (value: ControlledSelectOption['value'] | null) => ReactNode;
  valueClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  triggerId?: string;
  size?: 'sm' | 'default';
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  align?: 'start' | 'center' | 'end';
  alignItemWithTrigger?: boolean;
  chevronInheritsColor?: boolean;
  hideChevron?: boolean;
};
