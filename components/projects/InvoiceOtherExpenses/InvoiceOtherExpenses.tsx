import React from 'react';
import { Props } from './types';
import { Plus } from 'components/icons';
import { useInvoiceOtherExpenses } from './useInvoiceOtherExpenses';
import { AdvancedSelect, NormalInput } from 'components/shared';
import { formatCurrency, formatNumber, getCurrencySymbol } from 'helpers';
import { Textarea } from 'components';

const InvoiceOtherExpenses: React.FC<Props> = (props) => {
  const { fields, addNewExpense, removeExpense, getValues, currency, setValue } =
    useInvoiceOtherExpenses();

  return (
    <div className='w-full max-w-306'>
      {(getValues('expenses')?.length > 0 || !props.isInShowMode) && (
        <div className='grid w-full grid-flow-row grid-cols-62'>
          <div className='col-span-2 flex items-center justify-center rounded-tl-md border border-zinc-200 bg-indigo-50 pb-3 pt-4 text-sm font-medium text-indigo-900'>
            #
          </div>
          <div className='col-span-20 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm font-medium text-indigo-900'>
            Name
          </div>
          <div
            className={`${
              props.isInShowMode ? 'col-span-20' : 'col-span-12'
            } border border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4 text-sm font-medium text-indigo-900`}
          >
            Price
          </div>
          <div
            className={`${
              props.isInShowMode ? 'col-span-20' : 'col-span-12'
            } border border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4 text-sm font-medium text-indigo-900`}
          >
            VAT
          </div>
          {!props.isInShowMode && (
            <div className='col-span-16 border border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4 rounded-tr-md'></div>
          )}
        </div>
      )}
      {fields.map((expense, i) => {
        return (
          <div className='col-span-51 grid w-full grid-cols-62 bg-white' key={expense.id}>
            <div className='col-span-2 flex items-center justify-center border border-t-0 border-r-0 border-gray-100 py-6.5 font-medium leading-[1.625rem]  text-zinc-700'>
              {i + 1}
            </div>
            {!props.isInShowMode ? (
              <div className='col-span-20 flex items-center justify-center text-sm font-medium text-zinc-700'>
                <Textarea
                  inputName={`expenses.${i}.name`}
                  placeholder='Enter description'
                  className='pt-7 appearance-none h-full w-full focus:ring-0 border-gray-100! focus:border-gray-100! rounded-none px-6 resize-none'
                  noError={true}
                />
              </div>
            ) : (
              <div className='px-6 py-3 break-all col-span-20 flex items-center pl-6 text-sm font-medium text-zinc-700 border-b border-r border-l border border-gray-100'>
                {getValues(`expenses.${i}.name`)}
              </div>
            )}

            {!props.isInShowMode ? (
              <div className='col-span-12 flex items-center justify-center text-sm font-medium text-zinc-700 relative'>
                <div className=' absolute left-6 z-10'>{getCurrencySymbol(currency)}</div>
                <NormalInput
                  inputName={`expenses.${i}.price`}
                  placeholder='Enter price'
                  labelName='Price'
                  className='hide-number-arrows h-full w-full border-gray-100! focus:ring-0 focus:border-gray-100 rounded-none border-l-0 border-r-0 pl-9 autofill:bg-white selected:bg-white'
                  inputParentDivClasses='h-full'
                  noLabel={true}
                  type='number'
                />
              </div>
            ) : (
              <div
                className={`${
                  props.isInShowMode ? 'col-span-20' : 'col-span-12'
                } flex items-center px-7 text-sm font-medium text-zinc-700 border-b border-r border-gray-100 relative`}
              >
                {getCurrencySymbol(currency)}
                {formatNumber(formatCurrency(), Number(getValues(`expenses.${i}.price`) || 0))}
              </div>
            )}

            <div
              className={`${
                props.isInShowMode ? 'col-span-20' : 'col-span-12'
              } flex items-center  w-full text-sm font-medium text-zinc-700 border-b border-r border-gray-100 relative`}
            >
              <AdvancedSelect
                inputName={`expenses.${i}.vat_id`}
                list={[
                  { id: '', title: 'N/A' },
                  ...(props.vats as { id: number; title: string }[]),
                ]}
                placeholder='N/A'
                inputClassName='bg-transparent! disabled:text-black pl-7!  border-none! text-sm! focus:ring-0! focus:outline-hidden! w-full h-full hover:bg-transparent! transition-none!'
                dropDownStyles='top-12! shadow-md w-full!'
                className='w-full!'
                doNotLeavePlaceForError
                isTableCell
                canNotEdit={props.isInShowMode}
                onChangeHandler={(e) => {
                  setValue(`expenses.${i}.vat_amount`, (e as unknown as { amount: number }).amount);
                }}
                noSearch
              />
            </div>

            {!props.isInShowMode && (
              <div className='col-span-16 w-full h-full flex items-center justify-end border border-gray-100'>
                <button
                  className='rounded-full border border-gray-300 w-16 h-8 text-sm mr-6 hover:bg-red-700 hover:text-white'
                  onClick={(e) => removeExpense(e, i, props.setHaveOtherExpenses)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      {props.isInShowMode ? null : (
        <div
          className={`${
            !props.isInShowMode && 'pl-20'
          } col-span-51 grid w-full grid-cols-51 border border-t-0 border-gray-100 bg-white py-3.5 `}
        >
          {props.isInShowMode ? (
            <h1>show mode</h1>
          ) : (
            <button
              type='button'
              onClick={addNewExpense}
              className='flex items-center space-x-2 whitespace-nowrap text-zinc-400'
            >
              <Plus color='#999DA5' />
              <span>Add a row</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceOtherExpenses;
