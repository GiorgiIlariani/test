import { Props } from './types';
import React from 'react';
import { useFileUploadWithPreview } from './useFileUploadWithPreview';
import { FileIcon } from 'components';
import { generateRandomString } from 'helpers';
import { dragEnterHandler, dragLeaveHandler } from '../FileUploader/helpers';

const FileUploadWithPreview: React.FC<Props> = (props) => {
  const {
    dropHandler,
    avatarSrc,
    labelRef,
    isOpen,
    ref,
    handleAvatarChange,
    fileInput,
    register,
    existingImageFileInput,
  } = useFileUploadWithPreview(
    props.inputName,
    props.imageSrc,
    props.setCustomError,
    props.externalOnChange,
  );

  return props.loading ? (
    <div className='h-20 w-20 animate-pulse rounded-md bg-gray-300' />
  ) : (
    <div
      onDragOver={(e) => dragEnterHandler(e, labelRef)}
      onDragLeave={(e) => dragLeaveHandler(e, labelRef)}
      onDrop={dropHandler}
      className={props.className}
    >
      {avatarSrc ? (
        <div className='flex flex-col gap-2 py-4'>
          <div>
            <section
              className={!props.disabled ? 'group relative cursor-pointer' : 'pointer-events-none'}
              onClick={() => existingImageFileInput.current?.click()}
            >
              <img
                src={avatarSrc instanceof File ? URL.createObjectURL(avatarSrc) : avatarSrc}
                className={`h-20 object-cover hover:opacity-70  ${generateRandomString()}`}
                alt=''
              />

              <>
                <div
                  className={`${
                    isOpen ? 'block' : 'hidden'
                  } absolute z-50 w-52 translate-x-18 -translate-y-6`}
                  ref={ref}
                >
                  <input
                    hidden
                    ref={existingImageFileInput}
                    type='file'
                    onChange={handleAvatarChange}
                    accept='image/png, image/jpeg, image/jpg, image/bmp'
                    multiple={false}
                  />
                </div>
              </>
            </section>
            <p className='text-2xs text-red-500 mt-1 h-4 min-h-4'>{props.customError}</p>
          </div>
        </div>
      ) : (
        <label
          className='flex h-40 w-full flex-col items-center justify-center space-y-2 rounded-md border-indigo-600 bg-gray-50 hover:bg-neutral-100 transition-all border-2 border-dashed [[hidden]]:hidden'
          ref={labelRef}
          htmlFor={props.inputName}
          onClick={() => fileInput.current?.click()}
        >
          <input
            type='file'
            disabled={props.canNotEdit}
            {...register?.(props.inputName, {
              ...props.registerOptions,
              onChange: (e) => {
                handleAvatarChange(e);
              },
            })}
            className='hidden'
            multiple={false}
            hidden
            ref={fileInput}
            accept='image/*'
          />

          <div className='group flex h-full w-full cursor-pointer flex-col items-center justify-center'>
            <FileIcon />
            <span className='text-[#5A636F] font-medium text-sm'>
              Drop files here or <span className='text-indigo-600 underline'>Browse</span>
            </span>
            <span className='text-sm text-gray-700'>File up to 10MB</span>
          </div>
        </label>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
