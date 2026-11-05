import { Props } from './types';
import React, { Fragment } from 'react';
import {
  RadioWithLabel,
  NormalInput,
  Textarea,
  FileUploader,
  VacationRequestDaysCount,
  MultipleFileUploader,
} from 'components';
import {
  generateAvatarSrc,
  formatTextFirstStringUpperCase,
  capitalizeErrorMessage,
  validateThatDateIsSane,
  getWorkingDays,
} from 'helpers';
import { isUserVacationOwner, isUserReviewer } from '../VacationsModal/helpers';
import { validateWorkingDaysCount } from '../VacationRequestModal/helpers';
import { ErrorMessage } from '@hookform/error-message';
import { twMerge } from 'tailwind-merge';

const VacationModalRequestedInfoBox: React.FC<Props> = (props) => {
  const resetInternalProjectExcludeDays = (
    date: Date | null | undefined,
    otherType: 'start_date' | 'end_date',
  ) => {
    props.form.trigger(otherType);

    if (!date) return;

    const otherValue = new Date(props.form.getValues(otherType));

    let workingDays = getWorkingDays(
      otherType === 'start_date' ? otherValue : date,
      otherType === 'end_date' ? otherValue : date,
      props.holidayDates,
    );

    if (otherType === 'start_date') {
      workingDays++;
    }

    props.form.getValues('internal_projects').forEach((_, index) => {
      props.form.setValue(`internal_projects.${index}.is_excluded`, 'fully');
      props.form.setValue(`internal_projects.${index}.excluded_work_days`, workingDays);
    });
  };

  return (
    <div className='mx-6 mb-4'>
      <div className={twMerge('p-4 border rounded-xl', props.canNotEdit && 'bg-[#F9FAFB]')}>
        <div className='flex items-center gap-2'>
          <img
            className='rounded-full size-8 object-cover'
            width={100}
            height={100}
            src={
              props.employeeMinimalData?.avatar ??
              (props.employeeMinimalData?.first_name &&
                generateAvatarSrc(
                  props.employeeMinimalData?.first_name,
                  props.employeeMinimalData?.last_name,
                ))
            }
            alt={props.employeeMinimalData?.first_name}
          />

          <div className='flex flex-col'>
            <p>
              {`${props.employeeMinimalData?.first_name} ${props.employeeMinimalData?.last_name}`}
            </p>
          </div>

          {props.modalType !== 'pending' && (
            <p
              className={`${
                props.modalType === 'approved'
                  ? 'bg-[#ECFDF5] text-[#059669]!'
                  : 'bg-gray-200 text-gray-500'
              } text-xs px-2 py-0.5 font-medium rounded-full`}
            >
              {formatTextFirstStringUpperCase(props.modalType)}
            </p>
          )}
        </div>

        <div className='flex items-center flex-wrap gap-x-6 gap-y-1 mt-6 mb-4'>
          <RadioWithLabel
            label='Vacation'
            value='vacation'
            inputName='asking_for'
            wrapperClasses='w-min whitespace-nowrap'
            canNotEdit
          />
          <RadioWithLabel
            label='Sick leave'
            value='sick leave'
            inputName='asking_for'
            wrapperClasses='w-min whitespace-nowrap'
            canNotEdit
          />
          <RadioWithLabel
            label='Parental leave'
            value='parental leave'
            inputName='asking_for'
            wrapperClasses='w-min whitespace-nowrap'
            canNotEdit
          />
          <RadioWithLabel
            label='Unpaid leave'
            value='unpaid leave'
            inputName='asking_for'
            wrapperClasses='w-min whitespace-nowrap'
            canNotEdit
          />
        </div>

        {props.canNotEdit ? (
          <>
            <div className='flex items-center gap-4 md:gap-6'>
              <NormalInput
                inputName='start_date'
                labelName='Start'
                type='date'
                canNotEdit
                errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                doNotLeavePlaceForError
                disabledClasses='border-none text-zinc-400 bg-transparent font-normal hover:cursor-default'
              />
              <NormalInput
                inputName='end_date'
                labelName='End'
                type='date'
                canNotEdit
                errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                doNotLeavePlaceForError
                disabledClasses='border-none p-0 text-zinc-400 bg-transparent font-normal hover:cursor-default'
              />
            </div>

            <VacationRequestDaysCount
              holidayDates={props.holidayDates}
              currentEmployee={props.currentEmployee}
              type={props.currentVacation.type}
              reviewing={props.reviewing}
            />

            <Textarea
              label={
                <label htmlFor='comment' className='text-sm mt-6 block text-slate-900 font-medium'>
                  Comment
                </label>
              }
              inputName='comment'
              canNotEdit
              placeholder='Enter comment'
              className='resize-none bg-transparent! border-none text-zinc-700 pt-2! p-0!'
            />

            {props.currentVacation?.sick_notes?.length ? (
              <>
                <span className='mb-2 block text-left text-sm font-medium text-slate-900'>
                  Upload file
                </span>
                <div className='flex flex-col gap-2'>
                  {props.currentVacation?.sick_notes?.map((sickNote, i) => (
                    <Fragment key={(sickNote as { id: number; name: string; size: number })?.id}>
                      <FileUploader
                        inputName={`sick_notes[${i}]`}
                        allowedTypes={['pdf', 'word', 'image']}
                        allowedMimeTypes={[
                          'text/plain',
                          'application/pdf',
                          'application/msword',
                          'image/*',
                        ]}
                        canDownload={
                          isUserVacationOwner(props.userId, props.currentVacation) ||
                          isUserReviewer(props.userId, props.currentVacation)
                        }
                        canNotEdit
                        needsUnfilledState={false}
                        labelName=''
                      />
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
          </>
        ) : (
          <>
            <div className='flex items-center gap-4 md:gap-6'>
              <NormalInput
                inputName='start_date'
                labelName='Start *'
                type='date'
                placeholder='Start date'
                errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                doNotLeavePlaceForError
                registerOptions={{
                  required: 'Start date is required',
                  validate: {
                    sanityCheck: validateThatDateIsSane,
                    workingDays: (val) =>
                      validateWorkingDaysCount(
                        val,
                        props.form.getValues('end_date'),
                        'end_date',
                        props.holidayDates,
                      ),
                  },
                }}
                OnDateChange={(date?: Date | null) =>
                  resetInternalProjectExcludeDays(date, 'end_date')
                }
              />
              <NormalInput
                inputName='end_date'
                labelName='End *'
                type='date'
                placeholder='End date'
                errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                registerOptions={{
                  required: 'End date is required',
                  validate: {
                    sanityCheck: validateThatDateIsSane,
                    workingDays: (val) =>
                      validateWorkingDaysCount(
                        val,
                        props.form.getValues('start_date'),
                        'start_date',
                        props.holidayDates,
                      ),
                  },
                }}
                OnDateChange={(date?: Date | null) =>
                  resetInternalProjectExcludeDays(date, 'start_date')
                }
              />
            </div>

            <VacationRequestDaysCount
              holidayDates={props.holidayDates}
              currentEmployee={props.currentEmployee}
              type={props.currentVacation.type}
              reviewing={props.reviewing}
            />

            <Textarea
              label={
                <label htmlFor='comment' className='text-sm mt-6 block text-slate-900 font-medium'>
                  Comment <span className='text-zinc-400'>(optional)</span>
                </label>
              }
              inputName='comment'
              placeholder='Enter comment'
              registerOptions={{
                maxLength: {
                  message: 'Comment can not be longer than 255 characters',
                  value: 255,
                },
              }}
            />

            <div className='text-left text-red-500 mt-1 h-6 min-h-6 text-xs'>
              <ErrorMessage
                render={capitalizeErrorMessage}
                name='comment'
                errors={props.form.formState.errors}
              />
            </div>

            {props.type !== 'vacation' && props.type !== 'unpaid leave' && (
              <>
                <span className='text-sm font-medium text-slate-900'>
                  Upload doctor&apos;s note
                </span>
                <MultipleFileUploader
                  name='sick_notes'
                  allowedMimeTypes={[
                    'text/plain',
                    'application/pdf',
                    'application/msword',
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ]}
                  allowedFilesExtensions={[
                    '.txt',
                    '.pdf',
                    '.doc',
                    '.docx',
                    '.jpg',
                    '.png',
                    '.jpeg',
                  ]}
                />
              </>
            )}
          </>
        )}
      </div>

      {props.currentVacation && (
        <div className='mt-3 w-full text-sm text-right text-zinc-700 font-medium'>
          <p>
            <span>Requested at: </span>
            {new Date(props.currentVacation.request_date)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .replace(/\//g, '.')}
          </p>
        </div>
      )}
    </div>
  );
};

export default VacationModalRequestedInfoBox;
