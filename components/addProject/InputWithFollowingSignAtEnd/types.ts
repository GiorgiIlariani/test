import { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  inputName: string;
  sign: ReactNode | string;
  changeEvent?: (event: ChangeEvent<HTMLInputElement>) => void;
  blurEvent?: (event: MouseEvent<HTMLInputElement>) => void;
  className?: string;
  signClasses?: string;
  placeholder?: string;
  isInShowMode?: boolean;
  externalKeyDownHandler?: (e: KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  doNotCutSize?: boolean;
  allowFloats?: boolean;
  registerOptions?: RegisterOptions;
  renderError?: boolean;
};
