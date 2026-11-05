import { Props } from './types';
import React from 'react';
import {
  NormalInput,
  PortalWrapper,
  RadioWithLabel,
  VacationRequestDaysCount,
  Textarea,
  VacationReviewersInput,
  Loader,
  MultipleFileUploader,
  ErrorModal,
  BlueExclamationCircle,
  ModalPortalWrapper,
} from 'components';
import { useVacationRequestModal } from './useVacationRequestModal';
import { FormProvider } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { analytics, capitalizeErrorMessage, validateThatDateIsSane } from 'helpers';
import { validateWorkingDaysCount } from './helpers';

const VacationRequestModal: React.FC<Props> = (props) => {
  const {
    form,
    errors,
    loading,
    type,
    submitHandler,
    datesChangeHandler,
    holidayDates,
    currentEmployee,
    areVacationDaysOverTheLimit,
    setAreVacationDaysOverTheLimit,
    vacationExceededDays,
  } = useVacationRequestModal(
    props.toggleModal,
    props.reviewers!,
    props.updateVacations,
    props.adding,
    props.vacations,
  );

  return (
    <>
      {areVacationDaysOverTheLimit ? (
        <PortalWrapper>
          <ErrorModal
            confirmText='Submit anyway'
            modalMessage={`The requested vacation exceeds the ${new Date(
              form.getValues('start_date'),
            ).getFullYear()} limit by ${vacationExceededDays} ${
              vacationExceededDays > 1 ? 'days' : 'day'
            }.`}
            modalSecondaryMessageSpan='Are you sure you want to submit this request?'
            modalTitle='Vacation Limit Exceeded'
            confirmButtonColor='bg-indigo-500'
            confirmButtonFocusColor='focus:ring-indigo-800'
            confirmButtonHoverColor='hover:bg-indigo-700'
            icon={<BlueExclamationCircle className='h-10 w-10' />}
            iconBackgroundColor=''
            closeHandler={() => setAreVacationDaysOverTheLimit(false)}
            confirmFunction={() => submitHandler(form.getValues(), true)}
            isLoading={loading}
          />
        </PortalWrapper>
      ) : (
        <ModalPortalWrapper
          title={`Ask For ${type}`}
          titleClassName='capitalize'
          onClose={props.toggleModal}
        >
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit((data) => submitHandler(data))}>
              <div className='p-6'>
                <div className='flex items-center flex-wrap gap-x-6 gap-y-1'>
                  <RadioWithLabel
                    label='Vacation'
                    value='vacation'
                    inputName='type'
                    wrapperClasses='w-min whitespace-nowrap'
                    externalChangeHandler={(e) =>
                      analytics.track(
                        `Time offs - vacation type ${(e?.currentTarget as HTMLInputElement).value}`,
                      )
                    }
                  />
                  <RadioWithLabel
                    label='Sick leave'
                    value='sick leave'
                    inputName='type'
                    wrapperClasses='w-min whitespace-nowrap'
                    externalChangeHandler={(e) =>
                      analytics.track(
                        `Time offs - vacation type ${(e?.currentTarget as HTMLInputElement).value}`,
                      )
                    }
                  />
                  <RadioWithLabel
                    label='Parental leave'
                    value='parental leave'
                    inputName='type'
                    wrapperClasses='w-min whitespace-nowrap'
                    externalChangeHandler={(e) =>
                      analytics.track(
                        `Time offs - vacation type ${(e?.currentTarget as HTMLInputElement).value}`,
                      )
                    }
                  />
                  <RadioWithLabel
                    label='Unpaid leave'
                    value='unpaid leave'
                    inputName='type'
                    wrapperClasses='w-min whitespace-nowrap'
                    externalChangeHandler={(e) =>
                      analytics.track(
                        `Time offs - vacation type ${(e?.currentTarget as HTMLInputElement).value}`,
                      )
                    }
                  />
                </div>

                <div className='text-left text-red-500 mt-1 h-6 min-h-6 text-xs'>
                  <ErrorMessage render={capitalizeErrorMessage} name='type' errors={errors} />
                </div>

                <div className='flex items-center gap-4 md:gap-6'>
                  <NormalInput
                    inputName='start_date'
                    labelName='Start *'
                    placeholder='Start date'
                    type='date'
                    errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                    doNotLeavePlaceForError={true}
                    registerOptions={{
                      required: 'Start date is required',
                      validate: {
                        sanityCheck: validateThatDateIsSane,
                        workingDays: (val) =>
                          validateWorkingDaysCount(
                            val,
                            form.getValues('end_date'),
                            'end_date',
                            holidayDates,
                          ),
                      },
                    }}
                    OnDateChange={datesChangeHandler}
                  />
                  <NormalInput
                    inputName='end_date'
                    labelName='End *'
                    placeholder='End date'
                    type='date'
                    errorBaseHeight='h-0! min-h-0! whitespace-nowrap'
                    registerOptions={{
                      required: 'End date is required',
                      validate: {
                        sanityCheck: validateThatDateIsSane,
                        workingDays: (val) =>
                          validateWorkingDaysCount(
                            val,
                            form.getValues('start_date'),
                            'start_date',
                            holidayDates,
                          ),
                      },
                    }}
                    OnDateChange={datesChangeHandler}
                  />
                </div>

                <VacationRequestDaysCount
                  holidayDates={holidayDates}
                  currentEmployee={currentEmployee}
                  reviewing={true}
                />

                <Textarea
                  label={
                    <label
                      htmlFor='comment'
                      className='text-sm mt-6 block text-slate-900 font-medium'
                    >
                      Comment <span className='text-zinc-400'>(optional)</span>
                    </label>
                  }
                  inputName='comment'
                  registerOptions={{
                    maxLength: {
                      message: 'Comment can not be longer than 255 characters',
                      value: 255,
                    },
                  }}
                  placeholder='Enter comment'
                />

                <div className='text-left text-red-500 mt-1 h-6 min-h-6 text-xs'>
                  <ErrorMessage render={capitalizeErrorMessage} name='comment' errors={errors} />
                </div>

                {type !== 'vacation' && type !== 'unpaid leave' && (
                  <>
                    <span className='text-sm font-medium text-slate-900 mb-1 block'>
                      Upload doctor&apos;s note
                    </span>
                    <MultipleFileUploader
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
                      name='sick_notes'
                    />
                  </>
                )}

                <VacationReviewersInput reviewers={props.reviewers} />
              </div>

              <div className='border-t p-6 flex items-center justify-end gap-3 bg-white sticky bottom-0 z-10'>
                <button
                  type='button'
                  onClick={props.toggleModal}
                  className='transition-150-ease-in border border-zinc-200 hover:bg-gray-200 text-slate-900 py-1.5 px-3 rounded-md'
                >
                  Cancel
                </button>

                <div className='relative flex h-10 items-center justify-center'>
                  <div className='relative group h-full'>
                    <button
                      type='submit'
                      className='transition-150-ease-in text-white h-full px-3 rounded-md text-base bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                      disabled={
                        !form.getValues('reviewers')?.length ||
                        form.getValues('reviewers')?.[0]?.name === '' ||
                        loading
                      }
                    >
                      {loading ? <Loader size='16px' border='2px' /> : 'Send for approval'}
                    </button>

                    {(!form.getValues('reviewers')?.length ||
                      form.getValues('reviewers')?.[0]?.name === '') && (
                      <div className='absolute bottom-full left-[calc(50%-1px)] transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center'>
                        <span className='w-max bg-gray-800 text-white text-sm rounded-sm px-2 py-1'>
                          At least 1 reviewer is required
                        </span>
                        <div className='w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800'></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </ModalPortalWrapper>
      )}
    </>
  );
};

export default VacationRequestModal;
