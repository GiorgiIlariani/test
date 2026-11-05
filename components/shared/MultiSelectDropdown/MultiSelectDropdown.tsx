'use client';

import { twMerge } from 'tailwind-merge';
import { addClickAwayHandler } from 'helpers';
import { Props } from './types';
import { useMultiSelectDropdown } from './useMultiSelectDropdown';

const MultiSelectDropdown: React.FC<Props> = ({
  list,
  inputName,
  placeholder,
  label,
  disabled = false,
  className,
  dropdownClassName,
  chipClassName,
}) => {
  const {
    register,
    errors,
    isOpen,
    removeItem,
    toggleItem,
    toggleDropdown,
    buttonRef,
    dropdownRef,
    selected,
    setIsOpen,
  } = useMultiSelectDropdown(inputName, disabled);

  return (
    <div
      className={twMerge('relative w-full', className)}
      ref={buttonRef}
      onClick={(e) => toggleDropdown(e)}
    >
      {label && <label className='block mb-1 text-sm font-medium text-zinc-700'>{label}</label>}

      <div
        className={twMerge(
          'w-full border px-3 py-2 rounded-md min-h-[48px] flex flex-wrap gap-1 items-center bg-gray-50 border-zinc-200',
          disabled ? 'cursor-default' : 'cursor-pointer hover:bg-gray-300',
        )}
      >
        {selected.length === 0 && <span className='text-zinc-400 text-sm'>{placeholder}</span>}
        {selected.map((item) => (
          <span
            key={item}
            onClick={(e) => {
              e.stopPropagation();
              removeItem(item);
              addClickAwayHandler(buttonRef, dropdownRef, setIsOpen, undefined, undefined, true);
            }}
            className={twMerge(
              'flex items-center gap-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full',
              chipClassName,
            )}
          >
            {item}
          </span>
        ))}
      </div>

      {!disabled && isOpen && (
        <ul
          ref={dropdownRef}
          className={twMerge(
            'absolute z-50 w-full bg-white border border-zinc-300 mt-1 rounded-md max-h-48 overflow-auto shadow-sm',
            dropdownClassName,
          )}
        >
          {list.map((item) => (
            <li
              key={item}
              onClick={() => {
                toggleItem(item);
              }}
              className='flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 cursor-pointer text-sm'
            >
              <input type='checkbox' checked={selected.includes(item)} readOnly />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <input type='hidden' value={JSON.stringify(selected)} {...register(inputName)} />
      {errors[inputName] && (
        <p className='text-red-500 text-xs mt-1'>{errors[inputName]?.message as string}</p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
