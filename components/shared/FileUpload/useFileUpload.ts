import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { getFileKey } from 'helpers';
import { FileUploadProps } from './types';
import { FileUploadValue } from 'types';

export const useFileUpload = ({
  value,
  defaultValue = [],
  onChange,
  onRemove,
  id,
  name,
  disabled = false,
  multiple = true,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<FileUploadValue[]>(defaultValue);
  const selectedFiles = value ?? internalValue;
  const inputId = id ?? name;

  const updateFiles = (files: FileUploadValue[]) => {
    if (value === undefined) {
      setInternalValue(files);
    }

    onChange?.(files);
  };

  const addFiles = (fileList: FileList) => {
    const existingFiles = new Set(selectedFiles.map(getFileKey));
    const files = Array.from(fileList).filter((file) => {
      const key = getFileKey(file);

      if (existingFiles.has(key)) {
        return false;
      }

      existingFiles.add(key);
      return true;
    });

    if (!files.length) {
      return;
    }

    updateFiles(multiple ? [...selectedFiles, ...files] : [files[0]]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      addFiles(event.currentTarget.files);
      event.currentTarget.value = '';
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled || !event.dataTransfer.files?.length) {
      return;
    }

    addFiles(event.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const removedFile = selectedFiles[index];

    if (!removedFile) {
      return;
    }

    const files = selectedFiles.filter((_, fileIndex) => fileIndex !== index);

    updateFiles(files);
    onRemove?.(removedFile, files, index);
  };

  return {
    inputRef,
    inputId,
    selectedFiles,
    handleFileChange,
    handleDrop,
    removeFile,
  };
};
