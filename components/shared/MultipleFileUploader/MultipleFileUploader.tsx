import { ErrorMessage } from '@hookform/error-message';
import { Folder, TrashCanWithVerticalLines, DownloadWithCurvedBar, Loader } from 'components';
import React from 'react';
import { Props } from './types';
import { useMultipleFileUploader } from './useMultipleFileUploader';
import { capitalizeErrorMessage } from 'helpers';

const MultipleFileUploader: React.FC<Props> = (props) => {
  const {
    dragLeaveHandler,
    dragOverHandler,
    dropHandler,
    register,
    inputChangeHandler,
    files,
    fileRemoveHandler,
    errors,
    downloadHandler,
    fileDownloading,
  } = useMultipleFileUploader(
    props.name,
    props.setFilesToBeRemoved,
    props.allowedMimeTypes,
    props.allowedFilesExtensions,
  );

  return (
    <div className='w-full'>
      {props.isInShowMode && !files?.length && <p>-</p>}
      {!props.isInShowMode && (
        <label
          htmlFor={props.name}
          onDragLeave={dragLeaveHandler}
          onDragOver={dragOverHandler}
          onDrop={dropHandler}
          className='flex w-full cursor-pointer flex-col items-center justify-center space-y-2 rounded-md border border-dashed border-indigo-600 bg-indigo-50 py-6'
        >
          <Folder />
          <input
            type='file'
            {...register(props.name)}
            onChange={inputChangeHandler}
            id={props.name}
            multiple={true}
            className='hidden'
          />
          <span className='text-center text-sm leading-[1.375rem] text-indigo-600'>
            Drag & Drop your files here <br /> or
          </span>
          <button
            type='button'
            className='pointer-events-none rounded-md bg-indigo-600 py-1.5 px-3  text-white'
          >
            Upload
          </button>
        </label>
      )}
      {files?.map((file, i) => {
        return (
          <div
            key={i}
            className='flex w-full items-center justify-between border-b  border-gray-200  py-4'
          >
            <div className='flex w-full items-center justify-between'>
              <div className='flex w-[90%] items-center space-x-2'>
                <div className='rounded-md bg-gray-200 p-1'>
                  <Folder className='h-4 w-4' pathClassName='fill-gray-600' />
                </div>
                <span className='max-w-[80%] truncate text-sm text-zinc-700'>{file.name}</span>
              </div>
              {!props.isInShowMode ? (
                <button type='button' onClick={() => fileRemoveHandler(i)}>
                  <TrashCanWithVerticalLines />
                </button>
              ) : fileDownloading === i ? (
                <Loader size='16px' border='2px' />
              ) : (
                <button onClick={() => downloadHandler(i)} type='button'>
                  <DownloadWithCurvedBar />
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div className='h-10 text-left text-xs text-red-500'>
        <ErrorMessage render={capitalizeErrorMessage} name={props.name} errors={errors} />
      </div>
    </div>
  );
};

export default MultipleFileUploader;
