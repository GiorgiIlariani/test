import { ChangeEvent, KeyboardEvent } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  inputName: string;
  label: string;
  rightText: string;
  type: string;
  placeholder: string;
  registerOptions?: RegisterOptions;
  canNotEdit?: boolean;
  needsDraft?: boolean;
  externalOnChangeHandler?: (e: ChangeEvent) => void;
  needsUnfilledState?: boolean;
  externalKeyDownHandler?: (e: KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
  errorBaseHeight?: string;
  className?: string;
  labelClasses?: string;
  rightTextClasses?: string;
  inputWrapperClasses?: string;
  informationText?: string;
  extraMessageBlock?: null | JSX.Element;
};
