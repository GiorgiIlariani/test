import { FocusEventHandler, ReactElement } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  inputName: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  className?: string;
  placeholder?: string;
  label?: ReactElement | string;
  canNotEdit?: boolean;
  registerOptions?: RegisterOptions;
  noError?: boolean;
};
