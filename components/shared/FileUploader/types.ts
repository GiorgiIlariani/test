import { MIME_TYPES } from 'config';
import { RegisterOptions } from 'react-hook-form';
import { BackendMedia, SetState } from 'types';

export type MimeType = (typeof MIME_TYPES)[number];
export type Props = {
  labelName?: string;
  inputName: string;
  id?: string;
  canNotEdit?: boolean;
  canDownload?: boolean;
  externalOnChangeHandler?: (fileList: File[]) => void;
  needsUnfilledState?: boolean;
  wrapperClassNames?: string;
  allowedMimeTypes: (MimeType | Omit<string, MimeType>)[];
  allowedTypes?: string[];
  registerOptions?: RegisterOptions;
  maxSize?: `${number}mb`;
  multiple?: boolean;
  showMode?: boolean;
  fileErrors?: Record<string, string[] | null>;
  setFileErrors?: SetState<Props['fileErrors'] | undefined>;
  isImagePreview?: boolean;
  isLoading?: boolean;
  hideSizeText?: boolean;
  inputClasses?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  externalOnFileDelete?: (fileId: number) => void;
  showRequiredErrorMessage?: boolean;
};

export type FreshFiles = (Partial<BackendMedia> & { file: File; error?: string })[];
export type ExtractError = Array<Record<string, Record<'message', string>>>;
