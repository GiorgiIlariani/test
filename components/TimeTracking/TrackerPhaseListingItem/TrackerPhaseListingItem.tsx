import { Props } from './types';
import React, { ChangeEvent } from 'react';
import { useTrackerPhaseListingItem } from './useTrackerPhaseListingItem';
import { ErrorModal, NormalInput } from 'components/shared';
import { allowCertainNumbersLength, allowOnlyTimeInput } from 'helpers';
import { TrashCan, TrashCanWithVerticalLines } from 'components/icons';

const TrackerPhaseListingItem: React.FC<Props> = (props) => {
  const {
    onStartDateBlur,
    onEndDateBlur,
    onDurationHourBlur,
    onDurationMinutesBlur,
    setValue,
    hour,
    minutes,
    onDurationChange,
    createOrUpdateEntry,
    deleteEntryHandler,
    getValues,
    deleteDialog,
    setDeleteDialog,
  } = useTrackerPhaseListingItem(
    props.fieldName,
    props.projectIndex,
    props.termIndex,
    props.selectedDate,
    props.remove,
    props.setIsSaving,
    props.setDefaultData,
    props.updatePhaseTotalHours,
    props.getTimeLogEntriesHandler,
  );

  return (
    <li key={props.entries?.id} className='group grid grid-cols-[160px_140px_1fr] relative'>
      {deleteDialog && (
        <ErrorModal
          confirmText='Delete'
          modalMessage='Are you sure you want to delete this log?'
          modalTitle='Delete log'
          confirmButtonColor='bg-red-600'
          confirmButtonFocusColor='focus:ring-red-500'
          confirmButtonHoverColor='hover:bg-red-700'
          icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
          iconBackgroundColor='bg-red-100'
          closeHandler={() => {
            setDeleteDialog(false);
          }}
          confirmFunction={() => {
            deleteEntryHandler(getValues(props.fieldName).item_id, props.i);
            setDeleteDialog(false);
          }}
        />
      )}

      <div className='bg-white flex items-center gap-1.5 relative py-2 px-3 border-r'>
        {props.isDaySubmitted ? (
          <div className='text-sm text-zinc-700 flex items-center gap-1'>
            <p>{getValues(`${props.fieldName}.start_time`)}</p>-
            <p>{getValues(`${props.fieldName}.end_time`)}</p>
          </div>
        ) : (
          <>
            <div className='w-14'>
              <NormalInput
                inputName={`${props.fieldName}.start_time`}
                placeholder='11:00'
                className='h-7! w-full placeholder:text-zinc-400 px-[4px]! rounded-none! bg-gray-50!'
                blurHandler={(e) => {
                  onStartDateBlur(e as ChangeEvent<HTMLInputElement>);
                  if ((e?.target as HTMLInputElement).value === '') {
                    setValue(`${props.fieldName}.hour`, '');
                    setValue(`${props.fieldName}.minutes`, '');
                  }
                  props.updateOnBlur && createOrUpdateEntry(props.timeLogId);
                }}
                externalKeyDown={(e) => allowOnlyTimeInput(e)}
                canNotEdit={props.isDaySubmitted}
                doNotLeavePlaceForError
                isTableCell
              />
            </div>

            <p className='text-zinc-400 leading-none'>-</p>

            <div className='w-14'>
              <NormalInput
                inputName={`${props.fieldName}.end_time`}
                placeholder='19:00'
                className='h-7! w-full px-[4px]! rounded-none! bg-gray-50!'
                blurHandler={(e) => {
                  onEndDateBlur(e as ChangeEvent);
                  if ((e?.target as HTMLInputElement).value === '') {
                    setValue(`${props.fieldName}.hour`, '');
                    setValue(`${props.fieldName}.minutes`, '');
                  }
                  props.updateOnBlur && createOrUpdateEntry(props.timeLogId);
                }}
                externalKeyDown={(e) => allowOnlyTimeInput(e)}
                canNotEdit={props.isDaySubmitted}
                doNotLeavePlaceForError
                isTableCell
              />
            </div>
          </>
        )}
      </div>

      <div className='bg-white flex items-center gap-1.5 relative py-2 px-3 border-r'>
        {props.isDaySubmitted ? (
          <div className='text-sm text-zinc-700 flex items-center gap-1'>
            <p>{getValues(`${props.fieldName}.hour`)}h</p>
            <p>{getValues(`${props.fieldName}.minutes`)}min</p>
          </div>
        ) : (
          <>
            <div className='flex items-center'>
              <div className='w-7'>
                <NormalInput
                  inputName={`${props.fieldName}.hour`}
                  placeholder='0'
                  className='h-7! px-[4px]! rounded-none! bg-gray-50! '
                  blurHandler={(e) => {
                    onDurationHourBlur(e as ChangeEvent);
                    if ((e?.target as HTMLInputElement).value === '') {
                      onDurationChange(0, minutes);
                    }
                    props.updateOnBlur && createOrUpdateEntry(props.timeLogId);
                  }}
                  externalKeyDown={(e) => allowCertainNumbersLength(e, 2)}
                  canNotEdit={props.isDaySubmitted}
                  doNotLeavePlaceForError
                  isTableCell
                />
              </div>
              <p className='text-sm text-zinc-400 pl-[3px]'>h</p>
            </div>

            <p className='text-zinc-400'>:</p>
            <div className='flex items-center'>
              <div className='w-7'>
                <NormalInput
                  inputName={`${props.fieldName}.minutes`}
                  placeholder='0'
                  className='h-7! px-[4px]! rounded-none! bg-gray-50! '
                  blurHandler={(e) => {
                    onDurationMinutesBlur(e as ChangeEvent);
                    if ((e?.target as HTMLInputElement).value === '') {
                      onDurationChange(hour, 0);
                    }
                    props.updateOnBlur && createOrUpdateEntry(props.timeLogId);
                  }}
                  externalKeyDown={(e) => allowCertainNumbersLength(e, 2)}
                  canNotEdit={props.isDaySubmitted}
                  doNotLeavePlaceForError
                  isTableCell
                />
              </div>
              <p className='text-sm text-zinc-400 pl-[3px]'>m</p>
            </div>
          </>
        )}
      </div>

      <div className='bg-white flex items-center gap-2 relative py-2 px-3 min-w-50'>
        <NormalInput
          inputName={`${props.fieldName}.note`}
          placeholder='Enter your work notes'
          className='disabled:bg-transparent! disabled:text-zinc-700! disabled:border-none! h-7! px-[4px]! rounded-none! bg-gray-50!'
          containerClasses='grow'
          blurHandler={() => {
            props.updateOnBlur && createOrUpdateEntry(props.timeLogId);
          }}
          canNotEdit={props.isDaySubmitted}
          doNotLeavePlaceForError
          isTableCell
        />

        {!props.isDaySubmitted && (
          <button
            type='button'
            className='cursor-pointer hover:opacity-80'
            onClick={() =>
              !getValues(props.fieldName).item_id
                ? deleteEntryHandler(getValues(props.fieldName).item_id, props.i)
                : setDeleteDialog(true)
            }
          >
            <TrashCanWithVerticalLines size='14' color='#5A636F' />
          </button>
        )}
      </div>
    </li>
  );
};

export default TrackerPhaseListingItem;
