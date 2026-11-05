import type { ReactNode } from 'react';

type AvatarUploadDirection = 'row' | 'column';

export type AvatarUploadProps = {
  value?: File | string | null;
  defaultValue?: File | string | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  label?: ReactNode;
  alt?: string;
  direction?: AvatarUploadDirection;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean;
};
