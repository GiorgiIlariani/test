import { RegisterOptions } from 'react-hook-form';

export type Props = {
  className?: string;
  placeholder?: string;
  inputName: string;
  registerOptions?: RegisterOptions;
  canNotEdit?: boolean;
};
