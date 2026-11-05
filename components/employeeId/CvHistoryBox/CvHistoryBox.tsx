'use client';

import {
  Download,
  Duplicate,
  Pencil,
  Share,
  ThinLineTrashCan,
  TransparentRedberryLogo,
  WhiteCheck,
} from 'components';
import { getCookie } from 'cookies-next';
import { analytics, can, copyToClipboard } from 'helpers';
import React from 'react';
import { Props } from './types';
import { useCvHistoryBox } from './useCvHistoryBox';
import dynamic from 'next/dynamic';
import { twMerge } from 'tailwind-merge';

const CvEditModal = dynamic(
  () => import('../../../components/employeeId/CvEditModal/CvEditModal'),
  {
    ssr: false,
  },
);

const CvHistoryBox: React.FC<Props> = (props) => {
  const {
    labelChoiceChangeHandler,
    whiteLabelChecked,
    checkRDBR,
    checkWhiteLabel,
    editingName,
    nameDoubleClickHandler,
    cvName,
    cvNameChangeHandler,
    onBluHandler,
    cvEditModalIsOpen,
    cvEditModalToggler,
    skills,
    cvData,
    copied,
    setCopied,
    cvId,
  } = useCvHistoryBox(props.cv, props.editCvName, props.reRendedCvHistory, props.setCvEditError);
  return (
    <div
      key={props.cv.id}
      className='flex flex-col rounded-md bg-white p-4 border border-neutral-100'
    >
      {cvEditModalIsOpen && cvData && (cvId ? +cvId! == +props.cv.id : true) && (
        <CvEditModal
          skills={skills}
          employee={props.employee}
          modalToggler={cvEditModalToggler}
          defaultValues={{
            ...cvData,
            educations: cvData.education,
            achievement: cvData.achievements,
            experience: cvData.experiences,
          }}
          canOverWriteCv={true}
          token={getCookie('token')}
          doesNotNeedWarning={true}
          cvName={props.cv.name}
          exportingCv={false}
          cvId={props.cv.id}
          cvVariant={whiteLabelChecked}
          reRendedCvHistory={props.reRendedCvHistory}
        />
      )}
      <div className='flex border-b border-gray-200 pb-6 mb-6 justify-between w-full'>
        <div className='flex flex-col gap-2 h-10'>
          <div className='flex items-center space-x-4 '>
            <div className='bg-slate-100 font-bold text-gray-700 w-10 rounded-full  flex items-center justify-center'>
              {props.i + 1}
            </div>
            <div className='flex flex-col gap-2'>
              <input
                onDoubleClick={nameDoubleClickHandler}
                readOnly={!editingName}
                onChange={cvNameChangeHandler}
                className={`font-medium ${
                  !editingName && 'focus:border-none focus:outline-hidden focus:ring-0'
                } text-gray-900 disabled:bg-white border-none!`}
                value={cvName}
                onBlur={(e) => {
                  onBluHandler(e);
                }}
              />
            </div>
          </div>
          {props.cvEditError?.id === props.cv.id && (
            <div className='flex min-h-6 pl-14 w-full items-center text-xs text-red-500'>
              {props.cvEditError.message}
            </div>
          )}
        </div>
        <div className='flex space-x-4'>
          {can('cv::update', props.permissions) && (
            <>
              <button
                onClick={() => props.duplicateCvModalOpenHandler(props.cv.id)}
                className=' w-10 pointer transition-150-ease-in hover:bg-gray-200 bg-gray-100 rounded-full h-10 flex items-center justify-center'
              >
                <Duplicate />
              </button>
              <button
                onClick={cvEditModalToggler}
                className=' w-10 pointer transition-150-ease-in hover:bg-gray-200 bg-gray-100 rounded-full h-10 flex items-center justify-center'
              >
                <Pencil color='#111827' />
              </button>
            </>
          )}
          {can('cv::delete', props.permissions) && (
            <button
              onClick={() => props.deletingCvModalOpenHandler(props.cv.id)}
              className='mx-auto transition-150-ease-in hover:bg-red-200 hover:pulse shrink-0 bg-red-100 flex items-center justify-center h-12 w-12 rounded-full  sm:mx-0 sm:h-10 sm:w-10'
            >
              <ThinLineTrashCan />
            </button>
          )}
        </div>
      </div>

      <div className='flex items-center min-h-12 h-12 justify-between'>
        <span className='text-xs italic'>
          <span className='text-gray-400'>Last changed: </span>
          <span className='text-gray-700 font-medium'>{props.cv.updated_at}</span>
        </span>
        <div className='flex items-center  h-full space-x-4'>
          <div
            className={twMerge(
              'flex space-x-4 cursor-pointer items-center',
              !can('cv::update', props.permissions) && 'opacity-40',
            )}
          >
            <span
              className={`${
                !whiteLabelChecked ? 'text-redberry-red' : 'text-gray-700 font-medium'
              } transition-150-ease-in font-medium`}
              onClick={() => can('cv::update', props.permissions) && checkRDBR()}
            >
              RDBR
            </span>
            <label
              htmlFor={`${props.i}-label-type`}
              className='select-none mx-auto  relative justify-self-center cursor-pointer bg-redberry-red self-center  w-10 h-6 rounded-2xl'
            >
              <input
                id={`${props.i}-label-type`}
                onChange={labelChoiceChangeHandler}
                checked={whiteLabelChecked}
                className='peer opacity-0'
                type='checkbox'
                disabled={!can('cv::update', props.permissions)}
              />
              <div className='w-full h-full rounded-2xl transition-150-ease-in '></div>
              <div className='h-6 w-6 transition-150-ease-in left-[2%] bg-redberry-red overflow-hidden  peer-checked:bg-white flex items-center justify-center   peer-checked:left-[40%] top-[5%] shadow-2xl rounded-full absolute'>
                {whiteLabelChecked ? '' : <TransparentRedberryLogo />}
              </div>
            </label>
            <span
              className={`${
                whiteLabelChecked ? 'text-redberry-red' : 'text-gray-700 '
              } transition-150-ease-in font-medium`}
              onClick={() => can('cv::update', props.permissions) && checkWhiteLabel()}
            >
              White label
            </span>
          </div>

          {can('cv::export', props.permissions) && (
            <>
              <div className='h-full w-px bg-gray-200'>&#8203;</div>
              <button
                onClick={() => {
                  copyToClipboard(props.cv, setCopied);
                  analytics.track('PDF - Copy Link');
                }}
                className={`${
                  copied
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'text-gray-700 bg-white hover:bg-gray-300'
                } border-gray-300 border w-36 font-medium text-xs  py-2 justify-center space-x-2 flex items-center rounded-md transition-150-ease-in focus:ring-indigo-400 focus:ring-1 focus:ring-offset-1`}
              >
                {copied ? <WhiteCheck /> : <Share />}
                <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
              </button>
            </>
          )}
          {can('cv::export', props.permissions) && (
            <button
              type='button'
              onClick={() => {
                analytics.track('PDF - Download From CV History');
                props.cvDownloadHandler(props.cv, whiteLabelChecked ? 'whitelabel' : 'redberry');
              }}
              className='transition-150-ease-in flex items-center space-x-2 rounded-md border border-zinc-200 bg-white py-2 px-5 text-xs font-medium text-gray-700 hover:bg-gray-300 focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1'
            >
              <Download color='#6B7280' />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvHistoryBox;
