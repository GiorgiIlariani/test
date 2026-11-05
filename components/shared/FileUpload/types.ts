import type { ReactNode } from 'react';
import type { FileUploadValue } from 'types';

export type FileUploadProps = {
  name: string;
  value?: FileUploadValue[];
  defaultValue?: FileUploadValue[];
  onChange?: (files: FileUploadValue[]) => void;
  onRemove?: (file: FileUploadValue, files: FileUploadValue[], index: number) => void;
  onBlur?: () => void;
  id?: string;
  accept?: string;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  className?: string;
  uploadLabel?: ReactNode;
  removeLabel?: ReactNode;
  'aria-invalid'?: boolean;
};
