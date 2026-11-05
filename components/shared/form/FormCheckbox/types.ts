import { BaseFormProps } from '../types';

export type FormCheckboxProps = BaseFormProps & {
  checkboxClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};
