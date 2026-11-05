import { Props } from './types';
import { useTrackerPlaseEntryList } from './useTrackerPlaseEntryList';
import { TrackerPhaseListingItem } from '../TrackerPhaseListingItem';
import { TimeLogEntry } from 'types';
import { TrackerPhaseListingActionButton } from '..';
import { getTermStatusIcon } from 'helpers';

const TrackerPlaseEntryList: React.FC<Props> = (props) => {
  const { fields, addNewEntry, remove, termIsDisabled, setIsInEditMode, isInEditMode } =
    useTrackerPlaseEntryList(props.projectIndex, props.termIndex, props.term);
  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 sm:mb-2'>
        <div className='flex items-center justify-between gap-4 text-sm font-medium'>
          <div className='sm:flex gap-8'>
            <p>{props.term?.budget?.title}</p>
            <p>{props.term.name}</p>
          </div>

          <div> {getTermStatusIcon(props.term.status)}</div>
        </div>

        <p className='text-xs font-medium bg-white sm:bg-transparent text-indigo-600 rounded-md text-center px-2 py-1'>
          Total: {props.term?.total?.hours ?? 0}h{' '}
          {props.term?.total?.minutes ? Math.floor(props.term?.total?.minutes) : 0}m
        </p>
      </div>

      <div className='overflow-auto rounded-md border'>
        <div className='grid grid-cols-[160px_140px_1fr] font-medium text-xs text-[#312E81]'>
          <div className='py-2 px-3 border-r bg-indigo-50'>Time Range</div>

          <div className='py-2 px-3 border-r bg-indigo-50'>Duration</div>

          <div className='flex items center justify-between py-2 px-3 min-w-50 bg-indigo-50'>
            <p>Notes</p>
            <TrackerPhaseListingActionButton
              isSaving={props.isSaving}
              setIsSubmitClicked={props.setIsSubmitClicked}
              timeLogIds={props.timeLogIds as number[]}
              termIsDisabled={termIsDisabled}
              setIsInEditMode={setIsInEditMode}
              isInEditMode={isInEditMode}
            />
          </div>
        </div>

        <ul>
          {fields?.map((entry, i: number) => {
            return (
              <TrackerPhaseListingItem
                key={i}
                i={i}
                fieldName={`projects.${props.projectIndex}.terms.${props.termIndex}.time_logs.0.entries.${i}`}
                entries={entry as unknown as TimeLogEntry}
                projectIndex={props.projectIndex}
                termIndex={props.termIndex}
                updatePhaseTotalHours={props.updatePhaseTotalHours}
                timeLogId={props.timeLogId}
                selectedDate={props.selectedDate}
                remove={remove}
                setIsSaving={props.setIsSaving}
                isDaySubmitted={termIsDisabled && !isInEditMode}
                getTimeLogEntriesHandler={props.getTimeLogEntriesHandler}
                updateOnBlur={true}
              />
            );
          })}
        </ul>
      </div>

      {!(termIsDisabled && !isInEditMode) && (
        <button
          type='button'
          className='cursor-pointer text-xs font-medium text-[#5A636F]'
          onClick={addNewEntry}
        >
          <span className='text-sm'>+</span> Add entry
        </button>
      )}
    </div>
  );
};

export default TrackerPlaseEntryList;
