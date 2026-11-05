import { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  inputName: string;
  registerOptions?: RegisterOptions;
  externalOnChange?: (e?: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  blurHandler?: (e?: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  externalKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  containerClasses?: string;
  isFormUpdated?: boolean;
  externalButtonClassName?: string;
  inputRef: RefObject<HTMLInputElement | null>;
};
