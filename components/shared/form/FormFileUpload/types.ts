import { FileUploadProps } from 'components/shared/FileUpload/types';
import { BaseFormProps } from '../types';
import { FileUploadValue } from 'types';

export type FormFileUploadProps = BaseFormProps &
  Omit<
    FileUploadProps,
    | 'aria-invalid'
    | 'defaultValue'
    | 'disabled'
    | 'id'
    | 'label'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'required'
    | 'value'
  > & {
    uploaderClassName?: string;
    onChange?: (files: FileUploadValue[]) => void;
  };
