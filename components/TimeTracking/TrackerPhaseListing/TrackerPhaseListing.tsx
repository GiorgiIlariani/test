import { Props } from './types';
import React from 'react';
import { useTrackerPhaseListing } from './useTrackerPhaseListing';
import { TrackerPlaseEntryList } from '../TrackerPlaseEntryList';
import { BlueExclamationCircle, EmptyBudgetEmoji } from 'components/icons';
import { PortalWrapper, ErrorModal } from 'components/shared';

const TrackerPhaseListing: React.FC<Props> = (props) => {
  const {
    getValues,
    updatePhaseTotalHours,
    isSubmitClicked,
    setIsSubmitClicked,
    dayIncludesDraft,
  } = useTrackerPhaseListing();

  return (
    <section className='flex flex-col'>
      {getValues('projects')?.length ? (
        <>
          {!!isSubmitClicked && (
            <PortalWrapper>
              <ErrorModal
                confirmText={`Submit ${typeof isSubmitClicked === 'boolean' ? 'day' : `phase`}`}
                modalMessage='Are you sure you want to submit this day?'
                modalTitle={`Submit ${typeof isSubmitClicked === 'boolean' ? 'day' : `phase`}`}
                confirmButtonColor='bg-indigo-500'
                confirmButtonFocusColor='focus:ring-indigo-800'
                confirmButtonHoverColor='hover:bg-indigo-700'
                icon={<BlueExclamationCircle className='h-10 w-10' />}
                iconBackgroundColor=''
                closeHandler={() => setIsSubmitClicked(false)}
                confirmFunction={() => {
                  !!isSubmitClicked
                    ? props.submitDay(isSubmitClicked as number[])
                    : props.submitDay();
                  setIsSubmitClicked(false);
                }}
              />
            </PortalWrapper>
          )}

          <div className='w-full max-h-100 md:max-h-150 overflow-y-auto'>
            <ol className='flex flex-col gap-8'>
              {getValues('projects')?.map((project, projectIndex: number) => (
                <li key={project.id} className='w-full bg-zinc-50 p-3 sm:p-4 xl:px-6 rounded-md'>
                  <h3 className='text-xl text-[#2C2B23] font-bold mb-4'>{project.project_name}</h3>

                  <div className='flex flex-col gap-12'>
                    <div className='flex flex-col gap-12'>
                      {project.terms?.map((term, termIndex: number) => {
                        let timeLogIds = term.time_logs?.[0]?.entries.map((el) => el.item_id);

                        return (
                          <div key={term.id}>
                            <TrackerPlaseEntryList
                              projectIndex={projectIndex}
                              termIndex={termIndex}
                              updatePhaseTotalHours={updatePhaseTotalHours}
                              selectedDate={props.selectedDate}
                              timeLogId={term.time_logs?.[0]?.id}
                              setIsSaving={props.setIsSaving}
                              term={term}
                              isSaving={props.isSaving}
                              project={project}
                              setIsSubmitClicked={setIsSubmitClicked}
                              timeLogIds={timeLogIds as number[]}
                              getTimeLogEntriesHandler={props.getTimeLogEntriesHandler}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <button
            type='button'
            disabled={!dayIncludesDraft}
            onClick={() => !props.isSaving && setIsSubmitClicked(true)}
            className='cursor-pointer text-sm text-white w-fit self-end rounded-md px-8 py-2 bg-indigo-600 font-medium mt-8 sm:mt-12 disabled:opacity-40'
          >
            {!dayIncludesDraft ? 'Submitted' : ' Submit Day'}
          </button>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center text-center w-full pb-14'>
          <EmptyBudgetEmoji />
          <h3 className='text-slate-900 font-medium pt-6'>No Projects for Today</h3>
          <p className='test-[#5A636F] text-sm pt-2'>You don’t have any projects assigned today</p>
        </div>
      )}
    </section>
  );
};

export default TrackerPhaseListing;
