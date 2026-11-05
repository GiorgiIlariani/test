import { UseFormSetError } from 'react-hook-form';
import { BackendMedia, SetState } from 'types';

export type Props = {
  name: string;
  isInShowMode?: boolean;
  setFilesToBeRemoved?: SetState<number[]>;
  allowedMimeTypes: string[];
  allowedFilesExtensions: string[];
};

export type ValidateFiles = (
  {
    oldFiles,
    newFiles,
  }: {
    oldFiles: File[] | BackendMedia[];
    newFiles: File[];
  },
  setError: UseFormSetError<any>,
  name: string,
  allowedMimeTypes: string[],
  allowedFilesExtensions: string[],
) => File[];
