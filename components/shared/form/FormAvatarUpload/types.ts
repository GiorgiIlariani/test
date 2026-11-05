import { AvatarUploadProps } from 'components';
import { BaseFormProps } from '../types';

export type FormAvatarUploadProps = BaseFormProps &
  Omit<
    AvatarUploadProps,
    | 'alt'
    | 'className'
    | 'defaultValue'
    | 'disabled'
    | 'id'
    | 'label'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'required'
    | 'aria-invalid'
    | 'value'
  > & {
    avatarClassName?: string;
    alt?: string;
    onChange?: (file: File | null) => void;
  };
