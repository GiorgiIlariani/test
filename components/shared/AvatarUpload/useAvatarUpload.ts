import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

export const useAvatarUpload = (
  value: File | string | null | undefined,
  defaultValue: File | string | null,
  onChange: ((file: File | null) => void) | undefined,
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<File | string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;

  const previewUrl = useMemo(() => {
    if (!selectedValue) {
      return '';
    }

    if (typeof File !== 'undefined' && selectedValue instanceof File) {
      return URL.createObjectURL(selectedValue);
    }

    return typeof selectedValue === 'string' ? selectedValue : '';
  }, [selectedValue]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateValue = (nextValue: File | null) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    updateValue(file);
  };

  const clearAvatar = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    updateValue(null);
  };

  const openFileDialog = () => inputRef.current?.click();

  return {
    inputRef,
    previewUrl,
    handleFileChange,
    clearAvatar,
    openFileDialog,
  };
};
