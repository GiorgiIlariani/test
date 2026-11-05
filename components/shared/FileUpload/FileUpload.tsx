import { FileTextIcon, Trash2Icon, UploadIcon } from 'lucide-react';

import { Button } from 'components';
import { cn } from 'lib';
import type { FileUploadProps } from './types';
import { useFileUpload } from './useFileUpload';
import { getFileSize } from 'helpers';

const FileUpload = ({
  onBlur,
  name,
  accept,
  helperText,
  disabled = false,
  required = false,
  multiple = true,
  className,
  uploadLabel = 'Upload files',
  removeLabel = 'Remove file',
  'aria-invalid': ariaInvalid,
  ...props
}: FileUploadProps) => {
  const { inputRef, inputId, selectedFiles, handleFileChange, handleDrop, removeFile } =
    useFileUpload({
      ...props,
      name,
      disabled,
      multiple,
    });

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <div
        className={cn(
          'flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-gray-50 text-gray-400 p-4 text-center transition',
          !disabled && 'cursor-pointer hover:border-primary hover:text-primary hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-60',
          ariaInvalid && 'border-destructive',
        )}
        role='button'
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type='file'
          accept={accept}
          className='hidden'
          disabled={disabled}
          required={required && !selectedFiles.length}
          multiple={multiple}
          onBlur={onBlur}
          onChange={handleFileChange}
        />

        <UploadIcon className='size-6' />

        <div className='text-sm'>
          <span className='font-medium text-primary'>{uploadLabel}</span>
          <span className='text-muted-foreground'> or drag and drop</span>
        </div>

        {helperText && <p className='text-xs text-gray-500'>{helperText}</p>}
      </div>

      {!!selectedFiles.length && (
        <div className='flex flex-col gap-2'>
          {selectedFiles.map((file, index) => {
            const fileName = file.name;
            const fileSize = getFileSize(file);

            return (
              <div
                key={`${fileName}-${index}`}
                className='flex w-full items-center gap-3 rounded-md border bg-muted px-4 py-3 text-sm'
              >
                <FileTextIcon className='size-5 shrink-0 text-gray-400' />

                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>{fileName}</p>
                  {fileSize && <p className='text-xs text-muted-foreground'>{fileSize}</p>}
                </div>

                <Button
                  type='button'
                  variant='destructive'
                  size='icon-sm'
                  disabled={disabled}
                  aria-label={String(removeLabel)}
                  onClick={() => removeFile(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
