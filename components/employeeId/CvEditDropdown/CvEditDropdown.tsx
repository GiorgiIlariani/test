import { DownChevron } from 'components';
import { Props } from './types';
import { useCvEditDropdown } from './useCvEditDropdown';

const CvEditDropdown: React.FC<Props> = (props) => {
  const { dropdownToggler, isOpen, buttonRef, dropdownRef, register } = useCvEditDropdown();

  return (
    <div className='relative py-6'>
      <button
        ref={buttonRef}
        type='button'
        onClick={dropdownToggler}
        className='flex w-fit items-center space-x-2 rounded-md border border-gray-200 py-2 px-4 font-medium text-gray-800 hover:bg-gray-200'
      >
        <span>Sections</span>

        <DownChevron />
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 z-20 mt-1 flex max-h-60 w-[18rem] flex-col items-center justify-start overflow-auto rounded-lg border border-gray-200 bg-white py-2 px-4'
        >
          {props.options?.map((option, i) => (
            <label
              key={option.id}
              className='flex w-full items-center justify-start space-x-4 py-2'
            >
              <input type='checkbox' {...register(`sections.${i}.selected`)} />
              <span className='text-slate-900'>{option.title}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CvEditDropdown;
