import { FileIcon, DeleteX, TextFile, WarningCircle } from 'components';
import { getReadableFileSize } from 'helpers';
import { checkError, dragEnterHandler, dragLeaveHandler } from './helpers';
import { useFileUploader } from './useFileUploader';
import { type Props } from './types';

const FileUploader: React.FC<Props> = (props) => {
  const {
    uploadFileHandler,
    handleDownload,
    deleteHandler,
    hideDropZone,
    dropHandler,
    labelRef,
    register,
    files,
    getValues,
  } = useFileUploader(
    props.inputName,
    props.externalOnChangeHandler,
    props.allowedMimeTypes,
    props.maxSize,
    props.multiple,
    props.showMode ?? props.canDownload,
    props.setFileErrors,
    props.externalOnFileDelete,
  );

  return (
    <div id={props.id} className={props.wrapperClassName}>
      {props.labelName && (
        <span className='mb-2 block text-left text-sm font-medium text-zinc-700'>
          {props.labelName}
        </span>
      )}

      {props.showRequiredErrorMessage && !files.length && (
        <div
          className={`text-left text-red-500 
            mb-1 min-h-5 text-xs`}
        >
          {!props.canNotEdit && (
            <p>{props.inputName.charAt(0).toUpperCase() + props.inputName.slice(1)} is required</p>
          )}
        </div>
      )}

      <div
        onDragOver={(e) => dragEnterHandler(e, labelRef)}
        onDragLeave={(e) => dragLeaveHandler(e, labelRef)}
        onDrop={dropHandler}
        className='flex flex-col'
      >
        <label
          className={`flex h-40 w-full flex-col items-center justify-center space-y-2 rounded-md border-indigo-600 bg-gray-50 hover:bg-neutral-100 transition-all border-2 border-dashed [[hidden]]:hidden ${props.labelClassName}`}
          ref={labelRef}
          hidden={
            hideDropZone ||
            (!props.multiple && !!getValues(props.inputName)) ||
            (props.multiple && props.canNotEdit)
          }
          htmlFor={props.inputName}
        >
          <input
            type='file'
            id={props.inputName}
            disabled={props.canNotEdit}
            {...register?.(props.inputName, {
              ...props.registerOptions,
              onChange: (e) => {
                uploadFileHandler(e);
              },
            })}
            className='hidden'
            multiple={props.multiple}
            hidden
          />

          <div className='group flex h-full w-full cursor-pointer flex-col items-center justify-center'>
            <FileIcon />
            <span className='text-[#5A636F] font-medium text-sm'>
              Drop files here or <span className='text-indigo-600 underline'>Browse</span>
            </span>
            <span className='text-sm text-gray-700'>File up to 10MB</span>
          </div>
        </label>
        {!files.length && getValues(props.inputName) && !props.multiple ? (
          <div className='h-10 w-full animate-pulse rounded-md bg-gray-300' />
        ) : (
          <div className='flex flex-col gap-2 mt-3'>
            {files.map(({ error, size, id, name }, i) => (
              <div
                key={id ?? name}
                className={`flex flex-col h-full w-full bg-neutral-100 text-sm justify-center py-3 gap-2 rounded-md ${
                  error || checkError(props.fileErrors, props.inputName) ? 'text-red-700' : ''
                }`}
              >
                <div className='px-4  flex items-center justify-center'>
                  {!!error || !!checkError(props.fileErrors, props.inputName) ? (
                    <WarningCircle />
                  ) : (
                    <div className='w-8'>
                      <TextFile />
                    </div>
                  )}
                  <div
                    className={`ml-2 truncate ${
                      id && props.canDownload ? 'cursor-pointer hover:underline' : ''
                    }`}
                    onClick={() => {
                      id && handleDownload(i, id, name);
                    }}
                  >
                    {name}
                  </div>
                  {!error && !checkError(props.fileErrors, props.inputName) && !!size && (
                    <span className='ml-2 text-xs text-[#9DA1A9]'>{getReadableFileSize(size)}</span>
                  )}
                  <div className='flex items-center justify-center space-x-2 w-4 ml-auto'>
                    {(!props.canNotEdit || props.showMode) && (
                      <button type='button' onClick={(e) => deleteHandler(e, name, id)}>
                        <DeleteX
                          classNames='w-3 h-4'
                          pathClassNames={
                            error || checkError(props.fileErrors, props.inputName)
                              ? 'fill-[#B91C1C]'
                              : 'fill-[#9DA1A9]'
                          }
                        />
                      </button>
                    )}
                  </div>
                </div>

                {(!!error || checkError(props.fileErrors, props.inputName)?.[i]) && (
                  <>
                    <div className='border-b border-[#DDE0E5]' />
                    <div className='text-xs text-red-700 px-4'>
                      {error || checkError(props.fileErrors, props.inputName)?.[i]}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
