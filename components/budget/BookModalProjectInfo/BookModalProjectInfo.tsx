import { Props } from './types';
import React from 'react';
import { useBookModalProjectInfo } from './useBookModalProjectInfo';
import { analytics, formatDate, generateAvatarSrc } from 'helpers';
import { AdvancedSelect, BasicSelect, CalendarIcon, InfoCircleSecond, X } from 'components';
import { twMerge } from 'tailwind-merge';
import { renderEmployeeWithImage } from 'components/vacations/VacationsModal/helpers';
import { AuthUser, StaffMinimalEmployee } from 'types';
import { PROJECT_TYPE_OPTIONS } from 'config';

const BookModalProjectInfo: React.FC<Props> = (props) => {
  const {
    reset,
    getValues,
    findProject,
    setSelectedProject,
    projectInput,
    projectManagers,
    setValue,
    nonBillableDepartments,
    clientOptions,
    createTemporaryClient,
    isTemporaryClientSelected,
  } = useBookModalProjectInfo(
    props.projects,
    props.setSelectedProjectCurrency,
    props.setSelectedProject,
    props.setSelectedProjectType,
  );

  return (
    <div className='h-full'>
      {getValues('internal_project_id')?.id || props.selectedProject ? (
        <div className='bg-[#EEF2FF] w-full rounded-md p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <p className='font-bold text-zinc-700 capitalize text-base'>
                {props.selectedProject?.title ?? props.projectData.project?.title}
              </p>
              {props.isInternal && (
                <div className='text-xs text-[#EFA516] flex items-center gap-1 font-medium'>
                  {' '}
                  <InfoCircleSecond />
                  Internal project
                </div>
              )}
            </div>

            {!!!props.editPhaseId && (
              <button
                type='button'
                className='hover:bg-gray-200 p-1 rounded-full'
                onClick={() => {
                  setSelectedProject(null);
                  props.setSelectedProjectCurrency(props.projectData?.currency ?? 'USD');
                  props.setSelectedProjectType(props.projectData?.project_type ?? 'default');
                  reset({
                    ...getValues(),
                    currency: props.projectData?.currency ?? 'USD',
                    internal_project_id: { id: null, title: '' },
                  });
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className='text-xs text-[#5A636F]'>1 Scope, {props.phaseLength} Phases</p>
          <div className='flex items-center gap-8 mt-5'>
            <div className='flex gap-1.5 items-center text-slate-900 pr-1 pt-1'>
              <img
                className={`rounded-full shrink-0 object-cover w-7 h-7 mt-2`}
                width={100}
                height={100}
                src={
                  props.selectedProject?.owner?.avatar ??
                  props.projectData?.project?.owner?.avatar ??
                  generateAvatarSrc(
                    props.selectedProject?.owner?.first_name ??
                      props.projectData?.project?.owner?.first_name!,
                    props.selectedProject?.owner?.last_name ??
                      props.projectData?.project?.owner?.last_name,
                  )
                }
                alt={'icon'}
              />
              <div className='flex flex-col items-start'>
                <p className='w-full truncate text-[8px] text-[#5A636F] h-4'>Project owner</p>
                <p className='w-full truncate text-xs'>
                  {(props.selectedProject?.owner?.first_name ??
                    props.projectData?.project?.owner?.first_name) +
                    ' ' +
                    (props.selectedProject?.owner?.last_name ??
                      props.projectData?.project?.owner?.last_name ??
                      '')}
                </p>
              </div>
            </div>
            <div className='flex flex-col items-start'>
              <p className='w-full truncate text-[8px] text-[#5A636F] h-4'>Dates</p>
              <div className='flex items-center gap-1'>
                <CalendarIcon height='14' width='14' />
                <p className='text-xs'>{`${formatDate(
                  props.selectedProject?.start_date ?? props.projectData.project?.start_date!,
                )} - ${formatDate(
                  props.selectedProject?.end_date ?? props.projectData?.end_date!,
                )}`}</p>
              </div>
            </div>
            <div className='flex flex-col items-start'>
              <p className='w-full truncate text-[8px] text-[#5A636F] h-4'>Currency</p>
              <div className='text-xs'>
                {props.selectedProject?.currency ?? props.projectData.project?.currency}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !getValues('internal_project_id')?.id && (
          <>
            <div>
              <AdvancedSelect
                inputName='internal_project_id'
                placeholder='Choose one or create new...'
                labelName='Project'
                inputClassName='w-full! text-sm!'
                list={props.projects as { id: number; title: string }[]}
                removeErrorMessage
                dropDownStyles='w-full! top-16!'
                className='w-full!'
                externalOnListItemClickHandler={(item) => {
                  findProject(+item!);
                  setValue('currency', props.projectData?.currency);
                  analytics.track('Budget book modal - Project name');
                }}
                searchOnChange
                searchOnChangeExternal={(value) => {
                  setSelectedProject(null);
                  setValue('project', { id: null, title: value });
                }}
                defaultValue={getValues('internal_project_id').title ?? getValues('project_title')}
                labelClassName='text-xs!'
                onKeyDownHandler={(e, setIsOpen, value) => {
                  if (e === 'Enter') {
                    setValue('internal_project_id', { id: null, title: value });
                    setIsOpen(false);
                  }
                }}
              />
            </div>
            {!projectInput.id && projectInput.title && (
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col items-start gap-1 mt-4 w-full'>
                  <p className='text-xs font-medium text-zinc-700'>Project owner</p>
                  <AdvancedSelect
                    inputName='project_owner'
                    list={projectManagers}
                    removeErrorMessage
                    dropDownStyles='w-full! top-10!'
                    externalButtonTextRenderer={(value) => {
                      let currentUSer = projectManagers?.find(
                        (user) => user.id == getValues(`project_owner`),
                      );
                      return currentUSer ? (
                        renderEmployeeWithImage(
                          value as number | string,
                          '',
                          (projectManagers ?? []) as StaffMinimalEmployee[],
                          { getValues, setValue },
                          `project_owner`,
                          currentUSer as unknown as AuthUser,
                          false,
                          true,
                          'w-5! h-5!',
                        )
                      ) : (
                        <p className='text-sm text-zinc-400 pt-1 px-2'>Choose project owner</p>
                      );
                    }}
                    externalOnListItemClickHandler={() =>
                      analytics.track('Budget book modal - Project owner')
                    }
                    externalButtonClassName='top-1! left-2 w-72!'
                    inputClassName='mt-0 text-sm! hover:bg-gray-200! disabled:bg-white!'
                    className={twMerge(
                      'h-10 w-full border bg-gray-50! rounded-md hover:bg-gray-200! cursor-pointer',
                    )}
                    chevronStyles='top-4! translate-y-0! right-3!'
                  />
                </div>
                <BasicSelect
                  inputName='currency'
                  labelName='Currency'
                  list={['USD', 'EUR', 'GBP', 'GEL']}
                  placeholder='Choose project currency'
                  inputClassName='text-sm!'
                  noSearch
                  dropDownStyles='max-h-36!'
                  labelClassName='text-xs!'
                  externalOnListItemClickHandler={() =>
                    analytics.track('Budget book modal - Project currency')
                  }
                />
                <BasicSelect
                  inputName='project_type'
                  labelName='Project type'
                  list={PROJECT_TYPE_OPTIONS.map((option) => option.value)}
                  placeholder='Choose project type'
                  className='-my-5'
                  inputClassName='text-sm!'
                  noSearch
                  dropDownStyles='max-h-36!'
                  labelClassName='text-xs!'
                  externalOnListItemClickHandler={() =>
                    analytics.track('Budget book modal - Project type')
                  }
                  externalOptionTextRenderer={(value) => {
                    const found = PROJECT_TYPE_OPTIONS.find((option) => option.value === value);
                    return found ? found.text : value;
                  }}
                />
                {getValues('project_type') === 'internal' ? (
                  <div className='flex flex-col items-start gap-1 w-full'>
                    <p className='text-xs font-medium text-zinc-700'>Department</p>
                    <AdvancedSelect
                      key='project-department'
                      inputName='department_id'
                      list={nonBillableDepartments}
                      placeholder='Choose department'
                      removeErrorMessage
                      dropDownStyles='w-full! top-auto! bottom-full! mt-0! mb-1!'
                      inputClassName='mt-0 text-sm! hover:bg-gray-200! disabled:bg-white!'
                      className={twMerge(
                        'h-10 w-full border bg-gray-50! rounded-md hover:bg-gray-200! cursor-pointer',
                      )}
                      chevronStyles='top-4! translate-y-0! right-3!'
                      externalOnListItemClickHandler={() =>
                        analytics.track('Budget book modal - Project department')
                      }
                    />
                  </div>
                ) : (
                  <div className='flex flex-col items-start gap-1 w-full'>
                    <p className='text-xs font-medium text-zinc-700'>Client</p>
                    <AdvancedSelect
                      key='project-client'
                      inputName='client_id'
                      list={clientOptions}
                      placeholder='Choose client'
                      removeErrorMessage
                      dropDownStyles='w-full! top-auto! bottom-full! mt-0! mb-1!'
                      inputClassName='mt-0 text-sm! hover:bg-gray-200! disabled:bg-white!'
                      className={twMerge(
                        'h-10 w-full border bg-gray-50! rounded-md hover:bg-gray-200! cursor-pointer',
                      )}
                      chevronStyles='top-4! translate-y-0! right-3!'
                      searchOnChange
                      resetLists
                      searchOnChangeExternal={createTemporaryClient}
                    />
                    {isTemporaryClientSelected && (
                      <p className='text-xs text-[#5A636F] text-left'>
                        This client will be created when you publish the budget. Add its full
                        billing and administrative details from the Clients page afterward.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default BookModalProjectInfo;
