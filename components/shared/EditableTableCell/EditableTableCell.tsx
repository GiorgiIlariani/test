import { TickCircle, CloseCircle } from 'components';
import { Props } from './types';
import { useEditableTableCell } from './useEditableTableCell';
import { analytics } from 'helpers';

const EditableTableCell: React.FC<Props> = (props) => {
  const { value, isActive, handleCancel, handleChange, handleSubmit } = useEditableTableCell(props);
  return (
    <form onSubmit={handleSubmit} className={`relative col-span-2 ${props.containerClassName}`}>
      <input
        value={`${props.currency || ''}${value}`}
        onChange={handleChange}
        className={`${props.className} max-w-full`}
        onClick={() => analytics.track('Revenue Pipeline - Add Target')}
      />

      {isActive && (
        <div className='absolute inset-0 flex gap-1 w-full items-center'>
          <button className='ml-auto cursor-pointer z-30 hover:opacity-50'>
            <TickCircle />
          </button>
          <div className='mr-2 cursor-pointer z-30 hover:opacity-50' onClick={handleCancel}>
            <CloseCircle />
          </div>
        </div>
      )}
    </form>
  );
};

export default EditableTableCell;
