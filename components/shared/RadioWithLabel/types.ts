import { ChangeEvent } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  label: string;
  inputName: string;
  value: string;
  registerOptions?: RegisterOptions;
  canNotEdit?: boolean;
  defaultChecked?: boolean;
  needsDraft?: boolean;
  externalChangeHandler?: (e?: ChangeEvent<HTMLInputElement>) => void;
  wrapperClasses?: string;
  disabledClass?: string;
  labelClasses?: string;
  inputClasses?: string;
  isControlled?: boolean;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
};
