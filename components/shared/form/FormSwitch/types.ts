import { BaseFormProps } from '../types';

export type FormSwitchProps = BaseFormProps & {
  switchClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};
