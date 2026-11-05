import { RegisterOptions } from 'react-hook-form';
import { SetState } from 'types';

export type Props = {
  inputName: string;
  disabled?: boolean;
  canNotEdit?: boolean;
  registerOptions?: RegisterOptions;
  className?: string;
  imageSrc: string;
  externalOnChange?: () => void;
  loading?: boolean;
  customError?: string;
  setCustomError: SetState<string>;
};
