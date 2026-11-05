import { Props } from './types';
import React from 'react';
import { useVatCreationSection } from './useVatCreationSection';
import { NormalInput, TrashCanWithVerticalLines } from 'components';
import { allowOnlyNumbersInInput } from 'helpers';

const VatCreationSection: React.FC<Props> = (props) => {
  const { fields, addNewVat, remove, checkForDuplicates, getValues } = useVatCreationSection();
  return (
    <div className='w-full xl:w-[60%] overflow-clip pb-12'>
      <div
        className={`grid grid-cols-13 grid-flow-row border font-medium bg-indigo-50 text-xs text-[#312E81] mt-2.5 w-[99%]`}
      >
        <div className='col-span-6 py-2 border-r px-3'>VAT Name</div>

        <div className='col-span-6 py-2 border-r px-3'>Amount (%)</div>
        <div className='flex items center justify-between col-span-1 py-2 border-r px-3'></div>
      </div>{' '}
      <ul>
        {props.loading ? (
          <div className='group grid grid-cols-13  border-b border-x cursor-default! bg-white relative w-[99%]'>
            <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-6 border-r'>
              <div className='text-gray-300 bg-gray-300 animate-pulse select-none w-36 h-8 rounded-md'></div>
            </div>
            <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-6 border-r'>
              <div className='text-gray-300 bg-gray-300 animate-pulse select-none w-36 h-8 rounded-md'></div>
            </div>
            <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-1 border-r'>
              <div className='text-gray-300 bg-gray-300 animate-pulse select-none w-12 h-8 rounded-md'></div>
            </div>
          </div>
        ) : (
          fields?.map((el, i) => (
            <li
              key={el.id}
              className={`group grid grid-cols-13  border-b border-x cursor-default! bg-white relative w-[99%]`}
            >
              <div
                className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-6 border-r'
                title={getValues(`vats.${i}.name`)}
              >
                <NormalInput
                  inputName={`vats.${i}.name`}
                  placeholder='Enter VAT name'
                  className='bg-transparent! border-none! px-0! !focus:border-none! focus:ring-0 w-full! outline-hidden! truncate'
                  doNotLeavePlaceForError
                  registerOptions={{
                    required: { value: true, message: 'Required field' },
                    validate: (value) => checkForDuplicates(value),
                    minLength: { value: 2, message: 'Enter at least 2 characters' },
                    maxLength: { value: 255, message: 'Do not enter more than 255' },
                  }}
                  isTableCell
                  containerClasses='w-full'
                  externalOnChange={() => props.setDataChanged(true)}
                  errorOnHover
                />
              </div>
              <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-6 border-r outline-hidden!'>
                <NormalInput
                  inputName={`vats.${i}.value`}
                  placeholder='Enter VAT'
                  externalKeyDown={(e) => allowOnlyNumbersInInput(e)}
                  className='bg-transparent! border-none! px-0! !focus:border-none! focus:ring-0 w-full! outline-hidden!'
                  doNotLeavePlaceForError
                  registerOptions={{
                    required: { value: true, message: 'Required field' },
                    validate: (e) => +e <= 100 || 'Enter valid VAT',
                  }}
                  isTableCell
                  containerClasses='w-full'
                  externalOnChange={() => props.setDataChanged(true)}
                  errorOnHover
                />
              </div>
              <div className='flex items-center justify-center gap-1.5 px-3 py-[0.438rem] relative col-span-1 border-r'>
                {' '}
                <button
                  type='button'
                  className='hover:opacity-80'
                  onClick={() => {
                    remove(i);
                    props.setDataChanged(true);
                  }}
                >
                  <TrashCanWithVerticalLines size='14' color='#5A636F' />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <button
        type='button'
        className='text-xs font-medium text-[#5A636F] pt-2.5'
        onClick={addNewVat}
      >
        <span className='text-sm'>+</span> Add a new VAT
      </button>
    </div>
  );
};

export default VatCreationSection;
