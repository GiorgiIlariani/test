import { Props } from './types';
import React from 'react';
import { useBookModal } from './useBookModal';
import {
  BasicSelect,
  BookModalPhaseItem,
  BookModalProjectInfo,
  CalendarIcon,
  CheckDocument,
  Coin,
  Draft,
  InfoCircleSecond,
  InformationHover,
  Loader,
  ModalWrapper,
  WarningTriangle,
} from 'components';
import {
  generateAvatarSrc,
  convertNumbersAsPrice,
  formatDate,
  getCurrencySymbol,
  capitalizeFirstLetter,
} from 'helpers';
import { twMerge } from 'tailwind-merge';

const BookModal: React.FC<Props> = (props) => {
  const {
    bookForm,
    fields,
    isLoading,
    draftFields,
    changeBudgetStatus,
    submitData,
    isModalProjectInfoFilled,
    setSelectedProjectCurrency,
    isCurrencyMisMatched,
    publishingTermsExists,
    externalOnChangeOnEdit,
    selectedProject,
    setSelectedProject,
    unpublishHandler,
    termsArePublishedOrUnpublished,
    draftList,
    draftDropdownShouldBeHigher,
    isTypeMisMatched,
    setSelectedProjectType,
    projectType,
  } = useBookModal(
    props.budgetData,
    props.projectData,
    props.setIsSuccessOpen,
    props.setPublishedBudgetData,
    props.setIsBookModalOpen,
    props.setProjectId,
    props.getBudgetingPhasesHandler,
    props.publishedBudgetIsInEditMode,
    props.setPublishedBudgetIsInEditMode,
    props.setPhaseStatusAfterPublish,
    props.arePublicHolidaysCounted,
    props.budgetForm,
    props.projects,
  );

  return (
    <ModalWrapper
      isOpen={true}
      handleClose={() => props.closeBookModal?.()}
      title={'Publish your budget'}
      headerClassName='border-none! pt-[1.875rem]! py-0! pb-2! px-[3.125rem]!'
      titleClassName='text-xl!'
      childClasses='px-[3.125rem]!'
      className=''
      formClassName='relative!'
      handleSubmit={submitData}
      hideFooter
      form={bookForm}
    >
      <div className='h-full flex flex-col justify-end'>
        <section className='flex items-center gap-8'>
          {!props.projectData?.owner || (
            <div className='flex gap-1.5 items-center text-slate-900 pt-1'>
              <>
                <img
                  className={`rounded-full shrink-0 object-cover w-5 h-5`}
                  width={100}
                  height={100}
                  src={
                    props.projectData?.owner?.avatar ??
                    generateAvatarSrc(
                      props.projectData?.owner?.avatar ?? props.projectData?.owner?.first_name,
                      props.projectData?.owner?.last_name,
                    )
                  }
                  alt={'icon'}
                />
                <p className='w-full text-xs truncate capitalize'>
                  {props.projectData?.owner?.first_name + ' ' + props.projectData?.owner?.last_name}
                </p>{' '}
              </>
            </div>
          )}
          <div>
            <div className='flex gap-1 items-center w-full text-xs'>
              <Coin height='14' width='14' />
              <p className='flex items-center gap-1'>
                {getCurrencySymbol(props.projectData.currency ?? 'USD')}{' '}
                {convertNumbersAsPrice(Number(props.budgetTotal?.subtotal) ?? 0)}
              </p>
              <p>({Math.round(props.budgetTotal?.profit_margin!)} %)</p>
            </div>
          </div>
          <div className='flex items-center gap-1 text-xs'>
            <CalendarIcon height='14' width='14' />
            <p>{`${formatDate(props.projectData?.start_date!)} - ${formatDate(
              props.projectData?.end_date!,
            )}`}</p>
          </div>
          {!!bookForm.getValues('are_public_holidays_counted') && (
            <div className='text-xs text-[#EFA516] flex items-center gap-1 font-medium'>
              {' '}
              <InfoCircleSecond />
              Public holidays are billed
            </div>
          )}
        </section>
        <section className='w-full flex gap-[5%] mt-9 pb-[1.875rem]'>
          <div className='w-[38%]'>
            <h3 className='text-zinc-400 pb-4 text-xs font-bold'>Publishing options</h3>
            <div className='flex flex-col gap-2'>
              <div className='bg-gray-50 rounded-md p-4 pb-0 h-[20vw] overflow-y-scroll'>
                <div className='flex items-center gap-1 relative'>
                  <CheckDocument />{' '}
                  <p className='text-xs font-medium'>
                    {' '}
                    Publishing ({bookForm.getValues('sumOfPublished')})
                  </p>
                  {!!props.editPhaseId && (
                    <InformationHover
                      text={
                        'Only the selected phase status can be edited. To edit others, select `Edit in Scope` in the project plan.'
                      }
                      extraHoverClasses='top-[4.5rem]! text-2xs! before:opacity-0 z-50'
                    />
                  )}
                  {!props.editPhaseId && props.publishedBudgetIsInEditMode && (
                    <button
                      type='button'
                      onClick={unpublishHandler}
                      disabled={!publishingTermsExists}
                      className='ml-6 px-0 text-xs border-none bg-transparent text-indigo-600 hover:underline rounded-none disabled:opacity-25 disabled:cursor-normal disabled:hover:no-underline'
                    >
                      Draft and Unpublish all phases
                    </button>
                  )}
                </div>
                <ul className='w-full pt-3.5 flex flex-col items-start gap-2'>
                  {fields?.map((item, i) => (
                    <li key={item.title} className='w-full'>
                      <BookModalPhaseItem
                        inputName={`published_phase.${i}`}
                        i={i}
                        changeBudgetStatus={() => changeBudgetStatus(false, i, item)}
                        externalOnChangeOnEdit={externalOnChangeOnEdit}
                        disabled={!!props.editPhaseId && item.item_id !== props.editPhaseId}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className='bg-gray-50 rounded-md p-4 pb-0!'>
                <div className='flex items-center gap-1'>
                  <Draft />{' '}
                  <p className='text-xs font-medium'>
                    {' '}
                    Drafts ({bookForm.getValues('sumOfDraft')})
                  </p>
                </div>
                {!bookForm.getValues('sumOfDraft') ? (
                  <p className='text-2xs text-[#5A636F] pt-3.5'>You don’t have draft phases. </p>
                ) : (
                  <ul className='w-full pt-3.5 flex flex-col items-center gap-2'>
                    {draftFields?.map((item, i) => (
                      <li key={item.title} className='w-full'>
                        <BookModalPhaseItem
                          inputName={`draft_phase.${i}`}
                          i={i}
                          isDraft
                          changeBudgetStatus={() => changeBudgetStatus(true, i, item)}
                          externalOnChangeOnEdit={externalOnChangeOnEdit}
                        />
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  className={`${
                    !bookForm.getValues('sumOfDraft') ? 'opacity-10' : 'opacity-100'
                  } flex items-center gap-2 pt-[15%] pb-4 `}
                >
                  {draftDropdownShouldBeHigher ? (
                    <p className='text-xs text-zinc-700 '>Draft phases will be</p>
                  ) : (
                    <p className='text-xs text-zinc-700 '>Current scope change:</p>
                  )}

                  <BasicSelect
                    key={draftList().join('-')}
                    inputName={'draft'}
                    list={draftList()}
                    className='w-44!'
                    inputClassName='text-xs pl-2.5! bg-white! h-[1.625rem]! w-full'
                    dropDownStyles={twMerge(
                      'top-6! -top-24!',
                      draftDropdownShouldBeHigher && '-top-[8.5rem]!',
                    )}
                    dropDownItemStyles='text-xs! normal-case!'
                    removeErrorMessage
                    noSearch
                    externalOptionTextRenderer={(value) =>
                      capitalizeFirstLetter(value?.toLocaleLowerCase())
                    }
                    canNotEdit={!bookForm.getValues('sumOfDraft')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-[57%] flex flex-col justify-between'>
            <div>
              <h3 className='text-zinc-400 pb-4 text-xs font-bold'>Project info</h3>
              <BookModalProjectInfo
                projects={props.projects}
                projectData={props.projectData}
                phaseLength={props.budgetData?.phase?.length}
                setSelectedProjectCurrency={setSelectedProjectCurrency}
                setSelectedProjectType={setSelectedProjectType}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                editPhaseId={props.editPhaseId}
                isInternal={projectType === 'internal'}
              />
            </div>

            {(isCurrencyMisMatched || isTypeMisMatched) && (
              <div
                className={twMerge(
                  'flex items-center justify-start gap-2 pt-16',
                  bookForm.getValues('project_type') === 'internal' && 'pt-10',
                  selectedProject && 'pt-56',
                )}
              >
                <WarningTriangle />
                <div className='text-xs flex flex-col items-start'>
                  <p className='text-zinc-700 font-medium'>
                    {isCurrencyMisMatched
                      ? 'Budget and project currencies do not match.'
                      : 'Budget and project types do not match.'}
                  </p>
                  <p className='text-[#5A636F]'>
                    {isCurrencyMisMatched
                      ? 'Please create a new project or go to budget and change the budget currency.'
                      : 'Please create a new project or go to budget and change the budget type.'}
                  </p>
                </div>
              </div>
            )}

            <div
              className={`${
                isLoading ||
                !!!isModalProjectInfoFilled ||
                isCurrencyMisMatched ||
                isTypeMisMatched ||
                !termsArePublishedOrUnpublished
                  ? 'opacity-20'
                  : 'opacity-100'
              } flex gap-6 items-center justify-end`}
            >
              <div className='flex items-center gap-6 justify-end'>
                {props.publishedBudgetIsInEditMode && !publishingTermsExists ? (
                  <p className='text-xs text-[#5A636F]'>
                    {bookForm.getValues('draft') === 'Saved as a new scope'
                      ? 'Cannot save as new scope when no phases are published'
                      : bookForm.getValues('draft') === 'Unpublish scope'
                      ? 'Budget will be unpublished'
                      : `Budget will be archived`}
                  </p>
                ) : (
                  <p className='text-xs text-[#5A636F]'>
                    {bookForm.getValues('sumOfPublished')} phases will be published
                  </p>
                )}
              </div>
              <button
                type='submit'
                disabled={
                  isLoading ||
                  !!!isModalProjectInfoFilled ||
                  isCurrencyMisMatched ||
                  isTypeMisMatched ||
                  !termsArePublishedOrUnpublished
                }
                className='flex items-center gap-2 bottom-0 rounded-md bg-indigo-600 py-2 px-8 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2'
              >
                Save & Publish
                {!isLoading || <Loader size='16px' border='2px' />}
              </button>
            </div>
          </div>
        </section>
      </div>
    </ModalWrapper>
  );
};

export default BookModal;
