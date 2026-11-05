'use client';

import { toastGeneralError } from 'helpers';
import { useClickOutSide } from 'hooks';
import { useRef, useState, DragEvent, ChangeEvent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { SetState } from 'types';

export const useFileUploadWithPreview = (
  inputName: string,
  imageSrc: string,
  setCustomError?: SetState<string>,
  externalOnChange?: () => void | undefined,
) => {
  const { setValue, register, getValues } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<File | string | null | undefined>(imageSrc ?? '');

  useEffect(() => {
    imageSrc && setAvatarSrc(imageSrc);
  }, [imageSrc]);

  const dropHandler = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    labelRef.current!.classList.remove('border-indigo-500');
    let files = e.dataTransfer.files;
    setAvatarSrc(files[0]);
  };

  const labelRef = useRef<HTMLLabelElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const existingImageFileInput = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: ChangeEvent) => {
    externalOnChange?.();
    const avatar = (e.currentTarget as HTMLInputElement)?.files?.[0] ?? null;

    setAvatarSrc(avatar);
    setValue(inputName, avatar);
    if (avatar?.size! / (1024 * 1024) > 10) {
      setCustomError?.('Max file size up to 10MB');
    } else {
      setCustomError?.('');
    }
    try {
    } catch (e: any) {
      toastGeneralError(e, e?.response?.data?.message, 'Error uploading avatar');
      setAvatarSrc(undefined);
    } finally {
      setIsOpen(false);
    }
  };

  const ref = useClickOutSide({ cb: () => setIsOpen(false) });

  const deleteImageHandler = () => {
    try {
      externalOnChange?.();
      setValue(inputName, '');
      setAvatarSrc('');
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  return {
    register,
    dropHandler,
    avatarSrc,
    setIsOpen,
    labelRef,
    isOpen,
    ref,
    handleAvatarChange,
    deleteImageHandler,
    fileInput,
    getValues,
    existingImageFileInput,
  };
};
