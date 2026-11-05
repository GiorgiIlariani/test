'use client';

import { getCookie } from 'cookies-next';
import { blobToLink, getReadableFileSize, toastGeneralError } from 'helpers';
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { getMediaFromS3Url, getMediaNonBlobRequest, getMediaRequest } from 'services';
import { FreshFiles, Props } from './types';
import { mergeIntoFileList } from './helpers';

export const useFileUploader = (
  inputName: string,
  externalOnChangeHandler: ((FileList: File[]) => void) | undefined,
  allowedMimeTypes: Props['allowedMimeTypes'],
  maxSizeMB = '10mb',
  multiple = false,
  showMode = false,
  setFileErrors?: Props['setFileErrors'],
  externalOnFileDelete?: (fileId: number) => void,
) => {
  const {
    setValue,
    setError,
    register,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState<FreshFiles>([]);
  const [isDownloading, setIsDownloading] = useState<number>();
  const [errorState, setErrorState] = useState<boolean>(false);
  const [hideDropZone, setHideDropZone] = useState<boolean>(false);
  const labelRef = useRef<HTMLLabelElement>(null);
  const maxSize = parseInt(maxSizeMB) * 1024 * 1024;

  const createBlob = useCallback(async (id: number) => {
    if (process.env.NEXT_PUBLIC_FILESYSTEM === 's3') {
      const data = await getMediaNonBlobRequest(getCookie('token'), id);
      const file = await getMediaFromS3Url(data.path);
      return new Blob([file]);
    } else {
      const data = await getMediaRequest(getCookie('token'), id);
      return new Blob([data]);
    }
  }, []);

  const downloadFromUrl = useCallback(async (id: number, name?: string) => {
    const blob = await createBlob(id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name ?? 'filename';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const downloadMedia = getValues(inputName);
  let downloadList: FreshFiles = useMemo(
    () => (downloadMedia instanceof Array ? downloadMedia : [downloadMedia]),
    [downloadMedia],
  );

  useEffect(() => {
    if (!showMode || !downloadList[0]) return;

    downloadList.forEach(async ({ id, name }, i) => {
      if (!id) return;

      const file = new File([await createBlob(id)], name ?? `new-file-${i}`);
      setFiles((prev) => {
        const newFiles = prev.some((f) => f.id === id)
          ? prev
          : [{ name: file.name, file: file, error: undefined, size: file.size, id }, ...prev];

        const filesToUpload = newFiles.map((file) => file.file);
        const newFileList = mergeIntoFileList(filesToUpload);
        setValue(inputName, multiple ? Array.from(newFileList) : Array.from(newFileList)[0]);

        return newFiles;
      });
    });
  }, [createBlob, downloadList, showMode, files, setValue, inputName, multiple]);

  useEffect(() => {
    if (errorState)
      setError(inputName, {
        type: 'validate',
        message: 'error file upload',
      });
  }, [inputName, setError, errorState]);

  const fileTypeIsAllowed = (file: File) =>
    allowedMimeTypes.some((type) => file.type === type || file.type.match(type as string));

  const fileUploader = async (fileList: FileList | []) => {
    const newFiles = Array.from(fileList);
    if (!newFiles.length) return;
    setFileErrors?.(undefined);

    clearErrors(inputName);
    clearErrors();
    externalOnChangeHandler?.(newFiles as File[]);

    setFiles((prev) => {
      let validationMessage: string | undefined = undefined;
      const updatedFileSet = [
        ...newFiles
          .filter((file, i) => !newFiles.slice(0, i).some((f) => f.name === file.name))
          .filter((newFile) => !prev.some((prevFiles) => prevFiles.name === newFile.name))
          .map((file) => {
            if (file.size > maxSize) {
              validationMessage = `File exceeds size limit ${getReadableFileSize(
                maxSize,
              )}. This file size is ${getReadableFileSize(file.size)}`;
              setErrorState(true);
            }

            if (!validationMessage && !fileTypeIsAllowed(file)) {
              validationMessage = 'This file type is not allowed';
              setErrorState(true);
            }

            if (validationMessage) {
              setError(inputName, {
                type: 'validate',
                message: validationMessage,
              });

              setFileErrors?.((prev) => {
                const copy = { ...prev };
                if (validationMessage) {
                  copy[inputName] = [validationMessage];
                }

                return copy;
              });
            }

            !multiple && !validationMessage && setHideDropZone(true);
            return {
              file,
              name: file.name,
              error: validationMessage,
              size: file.size,
              id: undefined,
            };
          }),
        ...prev,
      ];

      const filesToUpload = updatedFileSet.map((file) => file.file);
      const newFileList = mergeIntoFileList(filesToUpload);
      setValue(inputName, multiple ? Array.from(newFileList) : Array.from(newFileList)[0], {
        shouldDirty: true,
        shouldValidate: true,
      });

      return multiple ? updatedFileSet : [updatedFileSet[0]];
    });
  };

  const uploadFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;
    fileUploader(fileList || []);
  };

  const dropHandler = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    labelRef.current!.classList.remove('border-indigo-500');
    let files = e.dataTransfer.files;
    fileUploader(files);
  };

  const removeUploadedFile = (name: string) => {
    setFiles((prev) => {
      const fileIndex = prev.findIndex((fileObj) => fileObj.file.name === name);

      if (fileIndex < 0) return prev;
      const newList = [...prev.slice(0, fileIndex), ...prev.slice(fileIndex + 1)];

      const filesToUpload = newList.map((file) => file.file);
      const newFileList = mergeIntoFileList(filesToUpload);

      setValue(inputName, multiple ? Array.from(newFileList) : Array.from(newFileList)[0] ?? null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      !multiple && setHideDropZone(false);

      return newList;
    });
  };

  const deleteHandler = (e: MouseEvent<HTMLButtonElement>, name?: string, fileId?: number) => {
    e.preventDefault();
    externalOnFileDelete?.(fileId!);
    name && removeUploadedFile(name);
  };

  const handleDownload = async (i: number, id: number, name?: string) => {
    setIsDownloading(i);
    try {
      if (process.env.NEXT_PUBLIC_FILESYSTEM === 's3') {
        await downloadFromUrl(id, name);
      } else {
        const blob = await createBlob(id);
        blobToLink(blob!, name ?? `file-${i}`);
      }
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsDownloading(undefined);
    }
  };

  useEffect(() => {
    return () => {
      setFileErrors?.(undefined);
      setErrorState(false);
    };
  }, [setFileErrors]);

  return {
    uploadFileHandler,
    handleDownload,
    deleteHandler,
    isDownloading,
    hideDropZone,
    dropHandler,
    getValues,
    register,
    labelRef,
    errors,
    files,
  };
};
