'use client';

import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { ChangeEvent, DragEvent, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { getMediaRequest } from 'services';
import { BackendMedia } from 'types';
import { validateFiles } from './helpers';
import { Props } from './types';

export const useMultipleFileUploader = (
  name: string,
  setFilesToBeRemoved: Props['setFilesToBeRemoved'],
  allowedMimeTypes: Props['allowedMimeTypes'],
  allowedFilesExtensions: Props['allowedFilesExtensions'],
) => {
  const {
    setValue,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();
  const [fileDownloading, setFileDownloading] = useState<number | undefined>(undefined);
  const files: File[] | BackendMedia[] = useWatch({
    name,
  });
  const dragOverHandler = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragLeaveHandler = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dropHandler = (e: DragEvent<HTMLLabelElement>) => {
    clearErrors(name);
    e.preventDefault();
    e.stopPropagation();
    const filesArray = [...e.dataTransfer.files];
    const newFiles = validateFiles(
      {
        newFiles: filesArray,
        oldFiles: files,
      },
      setError,
      name,
      allowedMimeTypes,
      allowedFilesExtensions,
    );
    setValue(name, [...files, ...newFiles]);
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    clearErrors(name);
    if (e.target.files) {
      const filesArray = [...e.target.files];
      const newFiles = validateFiles(
        {
          newFiles: filesArray,
          oldFiles: files,
        },
        setError,
        name,
        allowedMimeTypes,
        allowedFilesExtensions,
      );
      setValue(name, [...files, ...newFiles]);
      e.target.value = '';
    }
  };

  const fileRemoveHandler = (index: number) => {
    const file = files[index];
    setFilesToBeRemoved?.((prev) => {
      return [...prev, (file as BackendMedia).id];
    });
    clearErrors(name);
    const newFiles = files;
    newFiles.splice(index, 1);
    setValue(name, newFiles);
  };

  const downloadHandler = async (i: number) => {
    setFileDownloading(i);
    const file = files[i];
    const id = (file as BackendMedia).id;
    try {
      const data = await getMediaRequest(getCookie('token'), id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      analytics.track(`Download - ${name}`);
      link.click();
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setFileDownloading(undefined);
    }
  };

  return {
    dragOverHandler,
    dragLeaveHandler,
    dropHandler,
    register,
    inputChangeHandler,
    files,
    fileRemoveHandler,
    errors,
    downloadHandler,
    fileDownloading,
  };
};
