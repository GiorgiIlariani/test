'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useClickOutSide } from 'hooks';
import { useContext, useState } from 'react';
import { updateAvatar } from 'services';

export const useUploadAvatar = (
  avatar: string | File | null | undefined,
  externalOnChange: (() => void) | undefined,
  userId: number,
) => {
  const [avatarSrc, setAvatarSrc] = useState<File | string | null | undefined>(avatar);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutSide({ cb: () => setIsOpen(false) });

  const { user } = useContext(GlobalApiInfo);

  const canUploadImage = user.role === 'admin' || userId == user?.id;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.currentTarget.files?.[0] ?? null;
    setAvatarSrc(avatar);

    try {
      await updateAvatar(getCookie('token'), userId, { avatar });
      externalOnChange?.();
    } catch (e: any) {
      toastGeneralError(e, e?.response?.data?.message, 'Error uploading avatar');
      setAvatarSrc(undefined);
    } finally {
      setIsOpen(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      await updateAvatar(getCookie('token'), userId, { avatar: null });
      setAvatarSrc(undefined);
      externalOnChange?.();
    } catch (e) {
      toastGeneralError(e);
    } finally {
      setIsOpen(false);
    }
  };

  return {
    handleAvatarChange,
    deleteAvatar,
    setIsOpen,
    avatarSrc,
    isOpen,
    ref,
    canUploadImage,
  };
};
