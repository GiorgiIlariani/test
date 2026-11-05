import { Props } from './types';
import { useTimeTrackModule } from './useTimeTrackModule';
import { Saved, LoadingCircle } from 'components';
import { FormProvider } from 'react-hook-form';
import { TrackerDateSection } from '../TrackerDateSection';
import { TrackerPhaseListing } from '../TrackerPhaseListing';
import { TrackerPhaseListingSkeleton } from '..';

const TimeTrackModule: React.FC<Props> = (props) => {
  const {
    isSaving,
    form,
    selectedDate,
    setSelectedDate,
    isLoading,
    setIsSaving,
    submitDay,
    dateArray,
    setDateArray,
    isDaySubmitted,
    getTimeLogEntriesHandler,
  } = useTimeTrackModule();

  return (
    <FormProvider {...form}>
      <form className='size-full'>
        {!props.hideHeader && (
          <h1 className='text-slate-900 font-bold text-2xl capitalize mb-4 lg:mb-6'>
            {' '}
            {props.name}’s Dashboard
          </h1>
        )}

        <div className='bg-white border border-zinc-200 rounded-md w-full p-4 sm:p-6'>
          <div className='flex flex-col gap-2 mb-3 sm:mb-4.5'>
            <h2 className='font-bold text-xl'>My entries</h2>

            <div>
              {isSaving ? (
                <div className='flex items-center gap-1 text-left w-36 justify-start'>
                  <LoadingCircle />
                  <p className='text-xs w-full'>Saving changes</p>
                </div>
              ) : (
                <div className='flex items-center gap-1 text-left justify-start'>
                  <Saved />
                  <p className='text-xs'>Changes saved</p>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <TrackerPhaseListingSkeleton />
          ) : (
            <>
              <TrackerDateSection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isLoading={isLoading}
                isSaving={isSaving}
                dateArray={dateArray}
                setDateArray={setDateArray}
                isDaySubmitted={isDaySubmitted}
              />

              <TrackerPhaseListing
                selectedDate={selectedDate}
                setIsSaving={setIsSaving}
                submitDay={submitDay}
                isDaySubmitted={isDaySubmitted}
                isSaving={isSaving}
                getTimeLogEntriesHandler={getTimeLogEntriesHandler}
              />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default TimeTrackModule;
