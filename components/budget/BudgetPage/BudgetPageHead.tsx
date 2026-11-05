import { Props } from './types';
import React from 'react';
import { useBudgetPage } from './useBudgetPage';
import {
  CalendarIcon,
  Saved,
  Link as UILink,
  AdvancedSelect,
  NormalInput,
  LoadingCircle,
  BasicSelect,
  Lock,
  ShadcnSidebarTrigger,
  TransformedInput,
  InfoCircleSecond,
  NewTab,
  FreeOfChargeToggle,
  Toggle,
  ThreeDots,
} from 'components';
import { twMerge } from 'tailwind-merge';
import { analytics, can, formatDate } from 'helpers';
import Link from 'next/link';
import { PROJECT_TYPE } from 'config';

const BudgetPageHead: React.FC<Props> = (props) => {
  const {
    getValues,
    setValue,
    isReadonly,
    reset,
    editPhaseId,
    projectId,
    getWidthClass,
    isPublished,
  } = useBudgetPage(props.publishedBudgetIsInEditMode, props.permissions, props.isCreateMode);

  return (
    <form className='w-full'>
      {props.publishedBudgetIsInEditMode && (
        <div className='bg-[#FAF2E4] h-9.5 text-[#EFA516] flex items-center justify-center w-full gap-1 font-medium text-sm'>
          <InfoCircleSecond />
          You are editing {!!editPhaseId ? 'published budget phase' : 'published budget'}
        </div>
      )}
      <div className='flex justify-between top-0 z-40 h-[4.5rem] w-full bg-white border-b border-zinc-200 pt-2.5 pb-3.5 pr-16 relative'>
        <ShadcnSidebarTrigger type='button' className='absolute top-5 left-2' />

        <div className='flex flex-col items-start h-[4.5rem] w-full'>
          <div className='flex items-center gap-5 w-[70%] pl-13'>
            {props.isLoading ? (
              <div className='w-72 h-9 bg-gray-300 animate-pulse rounded-md' />
            ) : (
              <AdvancedSelect
                inputName='internal_project_id'
                placeholder='Untitled'
                inputClassName='border-none! truncate bg-transparent! text-xl font-medium h-8  focus:ring-0 focus:border-transparent focus:outline-hidden'
                list={props.projects as { id: number; title: string }[]}
                removeErrorMessage
                disableArrowIcon
                externalButtonTextRenderer={(value) => {
                  return (
                    <p
                      className={twMerge(
                        'text-xl font-medium truncate w-24  md:w-56! lg:w-72 text-zinc-700 mt-[1.375rem] capitalize',
                        !(value as { id: number | null; title: string }).title && 'text-zinc-400',
                      )}
                      title={(value as { title: string }).title}
                    >
                      {(value as { id: number | null; title: string }).title
                        ? props.projects.find((item) => item.id == value)?.title ??
                          (value as { id: number | null; title: string })?.title
                        : 'Untitled'}
                    </p>
                  );
                }}
                onChangeHandler={props.onProjectTitleChangeHandler as () => void}
                onBlurHandler={() => {
                  !(getValues('internal_project_id') as { id: number }).id &&
                    props.submitOnBlur(getValues());
                  analytics.track('Project name field');
                }}
                dropDownStyles='w-72! top-8!'
                className='w-72!'
                firstRowIsDesc='Or choose from existing project'
                onKeyDownHandler={(e, setIsOpen) => {
                  if (e === 'Enter') {
                    !(getValues('internal_project_id') as { id: number }).id &&
                      props.submitOnBlur(getValues());
                    setIsOpen(false);
                  }
                }}
                canNotEdit={isReadonly}
              />
            )}
            {!!projectId && (
              <Link
                className={twMerge(
                  'ml-8 hover:opacity-40',
                  props.publishedBudgetIsInEditMode && 'ml-10',
                )}
                target='_blank'
                href={`/projects/${projectId}/plan`}
                title='Go to project plan'
              >
                <NewTab size='20' />
              </Link>
            )}
            {getValues('status') === 'published' && (
              <div className='text-2xs uppercase text-[#5A636F] px-2 py-0.5 bg-[#D1FAE5] rounded-[19px]'>
                Published
              </div>
            )}
            <div className='uppercase text-xs w-full'>
              <div className='rounded-sm w-fit py-1 bg-gray-50 flex items-center justify-start gap-4 px-2'>
                {props.isLoading ? (
                  <div className='w-44 h-5 mt-2 bg-gray-300 animate-pulse rounded-md' />
                ) : (
                  <>
                    <TransformedInput
                      inputName={'title'}
                      placeholder='Untitled'
                      blurHandler={() => {
                        reset(getValues());
                        analytics.track('Scope name field');
                        props.submitOnBlur(getValues());
                      }}
                      className={`border-none! pl-0! uppercase text-xs bg-transparent! focus:ring-0 focus:border-transparent ${getWidthClass()} text-ellipsis placeholder:text-zinc-190 focus:outline-hidden text-zinc-400`}
                      canNotEdit={isReadonly}
                      externalButtonClassName='top-0!'
                      displayValue={
                        getValues('title') ? (
                          <div className={`text-zinc-400 text-xs pt-2 truncate ${getWidthClass()}`}>
                            {getValues('title')}
                          </div>
                        ) : (
                          <div className='text-zinc-400 text-xs w-16 pt-2 truncate'> Untitled</div>
                        )
                      }
                    />

                    <div className='flex items-center gap-1'>
                      <CalendarIcon height='14' width='14' />
                      <p>{`${formatDate(getValues('start_date')!)} - ${formatDate(
                        getValues('end_date')!,
                      )}`}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-start w-full -mt-1 pl-13'>
            <div className='mt-2'>
              <UILink color={getValues('description') ? '#394049' : '#DFE2E7'} />
            </div>
            {props.isLoading ? (
              <div className='w-44 -ml-3 h-4 mt-2 bg-gray-300 animate-pulse rounded-md' />
            ) : (
              <NormalInput
                inputName={'description'}
                placeholder='Add backlog link, comment or other...'
                className='border-none! bg-transparent! text-xs placeholder:text-zinc-200! py-0!  h-6! px-1 focus:ring-0 focus:border-transparent focus:outline-hidden'
                blurHandler={() => {
                  props.submitOnBlur(getValues());
                  analytics.track('Scope description field');
                }}
                canNotEdit={isReadonly}
              />
            )}
          </div>
        </div>

        {isReadonly && isPublished && !props.publishedBudgetIsInEditMode ? (
          <div className='flex items-center justify-center gap-2 bg-gray-100 rounded-lg py-2 px-2 absolute top-3 right-16'>
            <Lock />
            <div className='flex flex-col items-start pr-5'>
              <p className='text-[#5A636F] text-xs font-bold'>You are viewing published budget</p>
              <p className='text-[#5A636F] text-2xs'>
                Changes you make will be reflected in project plan as well.
              </p>
            </div>
            {can('project::update', props.permissions) && (
              <button
                className='flex items-center justify-center gap-2 font-medium text-xs text-white px-[1.125rem] py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-800'
                onClick={props.editBudgetStateChange}
                type='button'
              >
                Edit budget
              </button>
            )}
          </div>
        ) : props.isSaving ? (
          <div className='flex items-center gap-1 text-right w-20 justify-end'>
            <LoadingCircle />
            <p className='text-xs w-full'>
              {props.publishedBudgetIsInEditMode ? 'Processing...' : 'Saving...'}
            </p>
          </div>
        ) : props.publishedBudgetIsInEditMode ? (
          <button
            className='flex items-center justify-center gap-2 font-medium text-xs px-2 py-0.5 rounded-md text-zinc-700 border border-gray-300 bg-white hover:bg-gray-200 w-28 h-10'
            onClick={props.resetToDefaultBudget}
            type='button'
          >
            Cancel editing
          </button>
        ) : (
          <div className='flex items-center gap-1 text-right w-36 justify-end'>
            <Saved />
            <p className='text-xs'>Changes saved</p>
          </div>
        )}
      </div>
      <div className='flex items-center justify-end w-full pl-5 py-4 pr-16'>
        <div className='flex items-center justify-between gap-2'>
          {props.isLoading ? (
            <div className='flex gap-2'>
              <div className='w-32 h-12 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-24 h-12 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-24 h-12 bg-gray-300 animate-pulse rounded-md' />
            </div>
          ) : (
            <>
              <AdvancedSelect
                inputName={'rate_card_id'}
                list={props.rateCards}
                placeholder={`${
                  !getValues('rate_card_id') && isReadonly ? 'Custom rates' : 'Rate cards'
                } `}
                inputClassName='text-sm! font-medium bg-white focus:ring-0 focus:outline-hidden disabled:text-zinc-700!'
                calculateWidth={144}
                noSearch
                removeErrorMessage
                removeChangeOnFocus
                onChangeHandler={() => {
                  props.submitOnBlur(getValues());
                  analytics.track('Rate card dropdown');
                }}
                doNotRenderList={props.rateCards?.map((el) =>
                  el.id == getValues('rate_card_id') ? el.id?.toString() : '',
                )}
                dropDownStyles='top-10! w-44!'
                emptyStateText={'No rate cards'}
                canNotEdit={getValues('project_type') === PROJECT_TYPE.INTERNAL || isReadonly}
                informationText={
                  getValues('project_type') === PROJECT_TYPE.INTERNAL && !isReadonly
                    ? 'Rates card is disabled for internal projects'
                    : undefined
                }
              />
              <BasicSelect
                inputName='currency'
                list={['USD', 'EUR', 'GBP', 'GEL']}
                placeholder='Choose currency'
                inputClassName='text-sm font-medium bg-white! focus:ring-0  focus:outline-hidden disabled:text-zinc-700! disabled:bg-transparent!'
                className='w-24'
                noSearch
                removeErrorMessage
                removeChangeOnFocus
                canNotEdit={!!(getValues('internal_project_id') as { id: number }).id || isReadonly}
                onChangeHandler={() => {
                  props.submitOnBlur(getValues());
                  analytics.track('Currency dropdown');
                }}
                doNotRenderList={['USD', 'EUR', 'GBP', 'GEL']?.map((el) =>
                  el === getValues('currency') ? el : '',
                )}
                dropDownStyles='top-10!'
              />

              <button
                ref={props.buttonRef}
                type='button'
                className={
                  'hover:bg-zinc-200 hover:rounded-full cursor-pointer py-1.5 px-1 rotate-90'
                }
                onClick={props.toggleAdditionalButtons}
              >
                <ThreeDots />
              </button>

              {props.isActionsClicked && (
                <div
                  ref={props.dropDownRef}
                  className={twMerge(
                    'absolute right-6 z-9999 top-34 w-52 overflow-hidden rounded-lg border border-gray-300 bg-white text-sm shadow-lg px-3 py-2',
                    props.publishedBudgetIsInEditMode && 'top-44',
                  )}
                >
                  <div className='flex items-center gap-2.5 mb-2'>
                    <p className='text-sm text-[#5A636F] font-medium'>Bill public holidays</p>
                    <FreeOfChargeToggle
                      inputName='are_public_holidays_counted'
                      showProject={isReadonly}
                      onChangeHandler={() => {
                        props.submitOnBlur(getValues(), true, true);
                        analytics.track('Count holidays toggle');
                      }}
                    />
                  </div>
                  <div className='flex items-center gap-2.5 '>
                    <p className='text-sm text-[#5A636F] font-medium'>Internal project</p>
                    <Toggle
                      inputName='project_type'
                      disabled={
                        !!(getValues('internal_project_id') as { id: number }).id || isReadonly
                      }
                      currentValue={getValues('project_type')}
                      values={[PROJECT_TYPE.DEFAULT, PROJECT_TYPE.INTERNAL]}
                      onChangeHandler={async (val) => {
                        setValue('project_type', val);
                        await props.submitOnBlur(getValues(), true, true);
                        props.setProjectTypeUpdated((prev) => !prev);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default BudgetPageHead;
