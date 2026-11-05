import { useTimeSheetModalItemModal } from './useTimeSheetModalItemModal';
import { PenIcon, SkeletonLoader, X } from 'components';
import { TrackerPhaseListingItem } from '..';
import { SetState, TimeLogEntry } from 'types';
import { FormProvider } from 'react-hook-form';

const TimeSheetModalItemModal: React.FC<{
  setIsModalOpen: SetState<boolean>;
  date: string;
  termId: number;
  employeeId: number;
  getModalData: () => void;
}> = (props) => {
  const {
    isInEditMode,
    setIsInEditMode,
    fields,
    remove,
    form,
    cancelHandler,
    addNewEntry,
    saveTimeLogEntries,
    setIsLoading,
    timeLogsAreNotSaved,
    isLoading,
    setDefaultData,
  } = useTimeSheetModalItemModal(props.date, props.termId, props.employeeId, props.getModalData);

  return (
    <div className='w-[60vw] lg:w-[48vw] z-99999 2xl:w-[35.7vw] block relative mx-auto shadow-md border overflow-y-auto max-w-306 rounded-lg bg-white p-0'>
      <header
        className={` flex justify-between px-6 py-4 sticky top-0  bg-white border-b border-zinc-200`}
      >
        <h3 className={` capitalize font-bold text-slate-900 text-base`}>TimeLog</h3>

        <button
          className='hover:bg-gray-200 p-1 rounded-full'
          onMouseDown={() => props.setIsModalOpen(false)}
          type='button'
        >
          <X />
        </button>
      </header>
      <FormProvider {...form}>
        <form className='px-6 pb-6 flex flex-col items-start'>
          {!isInEditMode ? (
            <button
              className='flex absolute top-4 right-8 z-999999 mr-6 p-2 text-xs font-medium gap-2 border border-zinc-200 rounded-md bg-white select-none hover:ring-1 ring-zinc-500'
              onClick={() => setIsInEditMode(true)}
            >
              Edit <PenIcon />
            </button>
          ) : (
            <div className='flex space-x-2 absolute top-3 right-10 z-999999 border-t border-gray-100  px-4  items-center justify-end'>
              <button
                type='button'
                className='transition-150-ease-in p-2 rounded-md bg-transparent  text-sm font-medium focus:ring-1 border border-zinc-200'
                onClick={() => cancelHandler()}
              >
                Cancel
              </button>
              <button
                type='button'
                className='p-2 transition-150-ease-in disabled:cursor-not-allowed h-full rounded-md bg-indigo-700 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2'
                onClick={() => saveTimeLogEntries()}
              >
                Save
              </button>
            </div>
          )}
          {!isLoading ? (
            timeLogsAreNotSaved ? (
              <h3 className='text-red-500 mt-2'>
                Time log {fields.length > 1 ? 'entries' : 'entry'} not submitted
              </h3>
            ) : (
              <h3 className='text-green-500 mt-2'>
                Time log {fields.length > 1 ? 'entries' : 'entry'} submitted
              </h3>
            )
          ) : (
            <div className='w-full -translate-x-3 mt-8'>
              <SkeletonLoader quantity={2} showToggle={false} />
            </div>
          )}
          {!isLoading && (
            <div
              className={`grid grid-cols-14 grid-flow-row border font-medium bg-indigo-50 text-xs text-[#312E81] mt-2.5 w-[99%]`}
            >
              <div className='col-span-4 py-2 border-r px-3'>Time Range</div>
              <div className='col-span-3 py-2 border-r px-3'>Duration</div>
              <div className='flex items center justify-between col-span-7 py-2 border-r px-3'>
                <p>Notes</p>{' '}
              </div>
            </div>
          )}
          {!isLoading && (
            <ul className='w-full'>
              {fields?.map((entry, i: number) => {
                return (
                  <TrackerPhaseListingItem
                    key={i}
                    i={i}
                    fieldName={`term.time_logs.0.entries.${i}`}
                    entries={entry as unknown as TimeLogEntry}
                    projectIndex={0}
                    termIndex={0}
                    timeLogId={entry.time_log_id!}
                    selectedDate={props.date}
                    remove={remove}
                    setIsSaving={setIsLoading}
                    isDaySubmitted={!isInEditMode}
                    setDefaultData={setDefaultData}
                  />
                );
              })}
            </ul>
          )}
          {isInEditMode && (
            <button
              type='button'
              className='text-xs font-medium text-[#5A636F] pt-2.5'
              onClick={addNewEntry}
            >
              <span className='text-sm'>+</span> Add entry
            </button>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default TimeSheetModalItemModal;
