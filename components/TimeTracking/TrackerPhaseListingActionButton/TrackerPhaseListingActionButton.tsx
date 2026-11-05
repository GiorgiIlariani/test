import { Send, X, Pencil } from 'components/icons';
import { Props } from './types';

const TrackerPhaseListingActionButton: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onMouseDown={() =>
          !props.isSaving && props.setIsSubmitClicked(props.timeLogIds as number[])
        }
        disabled={props.termIsDisabled}
        className='cursor-pointer flex items-center disabled:opacity-40 gap-1 text-2xs text-white rounded-md px-1 py-[2px] bg-indigo-600 font-medium'
      >
        {props.termIsDisabled ? (
          'Submitted'
        ) : (
          <>
            {' '}
            <Send />
            Submit phase
          </>
        )}
      </button>

      {props.termIsDisabled &&
        (!props.isInEditMode ? (
          <button
            type='button'
            className='cursor-pointer hover:opacity-50 h-5 w-5 flex items-center justify-center bg-white border rounded-full'
            onClick={() => props.setIsInEditMode(true)}
          >
            <Pencil size='10' />
          </button>
        ) : (
          <button
            type='button'
            className='cursor-pointer hover:opacity-50 h-5 w-5 flex items-center justify-center bg-white border rounded-full'
            onClick={() => props.setIsInEditMode(false)}
          >
            <X className='w-3 h-3' />
          </button>
        ))}
    </div>
  );
};

export default TrackerPhaseListingActionButton;
