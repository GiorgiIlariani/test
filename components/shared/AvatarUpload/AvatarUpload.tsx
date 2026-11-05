'use client';

import React from 'react';
import { ImagePlusIcon, Trash2Icon, UserIcon } from 'lucide-react';

import { Button } from 'components';
import { cn } from 'lib';
import { AvatarUploadProps } from './types';
import { useAvatarUpload } from './useAvatarUpload';

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  defaultValue = null,
  onChange,
  onBlur,
  id,
  name = 'avatar',
  label = 'Avatar',
  alt = 'Avatar preview',
  direction = 'row',
  required,
  disabled,
  className,
}) => {
  const { inputRef, previewUrl, handleFileChange, clearAvatar, openFileDialog } = useAvatarUpload(
    value,
    defaultValue,
    onChange,
  );

  return (
    <div className={cn('flex items-center gap-4', direction === 'column' && 'flex-col', className)}>
      <button
        type='button'
        disabled={disabled}
        onClick={openFileDialog}
        className='relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-60'
        aria-label='Upload avatar'
      >
        {previewUrl ? (
          <img src={previewUrl} alt={alt} className='h-full w-full object-cover' />
        ) : (
          <UserIcon className='size-8' />
        )}
      </button>

      <div
        className={cn(
          'flex flex-col gap-2',
          direction === 'column' ? 'items-center' : 'items-start',
        )}
      >
        <div>
          {label && <p className='text-sm font-medium'>{label}</p>}
          <p className='text-xs text-gray-500'>PNG, JPG, or WEBP</p>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled}
            onClick={openFileDialog}
          >
            <ImagePlusIcon />
            Upload
          </Button>

          {previewUrl && (
            <Button
              type='button'
              variant='destructive'
              size='sm'
              disabled={disabled}
              onClick={clearAvatar}
            >
              <Trash2Icon />
              Remove
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        id={id}
        name={name}
        type='file'
        accept='image/png,image/jpeg,image/webp'
        className='hidden'
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
