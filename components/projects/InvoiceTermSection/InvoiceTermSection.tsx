import { Props } from './types';
import { Plus } from 'components/icons';
import { useInvoiceTermSection } from './useInvoiceTermSection';
import { AdvancedSelect, NormalInput } from 'components/shared';
import { formatCurrency, formatNumber, getCurrencySymbol } from 'helpers';
import { Textarea } from 'components';
import { twMerge } from 'tailwind-merge';

const InvoiceOtherExpenses: React.FC<Props> = (props) => {
  const { fields, addField, removeField, getValues, currency, setValue } = useInvoiceTermSection(
    props.fieldName,
  );

  return (
    <div className='w-full max-w-306'>
      <div className='grid w-full grid-flow-row grid-cols-60'>
        <div
          className={twMerge(
            'col-span-17 flex items-center pl-6 rounded-tl-md border border-zinc-200 bg-indigo-50 pb-3 pt-4 text-sm font-medium text-indigo-900',
            props.hasCompletion && 'col-span-14',
          )}
        >
          Term name
        </div>
        {props.hasCompletion && (
          <div className='col-span-12 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm font-medium text-indigo-900'>
            Completion %
          </div>
        )}

        <div
          className={twMerge(
            'col-span-17 border border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4 text-sm font-medium text-indigo-900',
            props.hasCompletion && 'col-span-12',
            props.isInShowMode && 'col-span-33 rounded-tr-md',
            props.isInShowMode && props.hasCompletion && 'col-span-24 rounded-tr-md',
          )}
        >
          Price
        </div>
        <div
          className={twMerge(
            'col-span-10 border border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4 text-sm font-medium text-indigo-900',
          )}
        >
          VAT
        </div>

        {!props.isInShowMode && (
          <div
            className={twMerge(
              'col-span-16 border rounded-tr-md border-l-0 border-zinc-200 bg-indigo-50 pl-7 pb-3 pt-4',
              props.hasCompletion && 'col-span-12',
            )}
          />
        )}
      </div>

      {fields.map((expense, i) => {
        return (
          <div className='col-span-60 grid w-full grid-cols-60 bg-white' key={expense.id}>
            {!props.isInShowMode ? (
              <div
                className={twMerge(
                  'col-span-17 flex items-center justify-center text-sm font-medium text-zinc-700',
                  props.hasCompletion && 'col-span-14',
                )}
              >
                <Textarea
                  inputName={`${props.fieldName}.${i}.name`}
                  placeholder='Enter name'
                  className='pt-7 appearance-none h-full w-full focus:ring-0 border-gray-100! focus:border-gray-100! rounded-none px-6 resize-none'
                  noError={true}
                />
              </div>
            ) : (
              <div
                className={twMerge(
                  'col-span-17 px-6 py-3 break-all flex items-center pl-6 text-sm font-medium text-zinc-700 border-b border-r border-l border border-gray-100',
                  props.hasCompletion && 'col-span-14',
                )}
              >
                {getValues(`${props.fieldName}.${i}.name`)}
              </div>
            )}

            {props.hasCompletion &&
              (!props.isInShowMode ? (
                <div className='col-span-12 flex items-center justify-center text-sm font-medium text-zinc-700 relative border-r border-gray-50'>
                  <NormalInput
                    inputName={`${props.fieldName}.${i}.completion_percent`}
                    placeholder='Enter completion %'
                    labelName='Price'
                    className='hide-number-arrows h-full w-full border-gray-100! focus:ring-0 focus:border-gray-100 rounded-none border-l-0 border-r-0 pl-9 autofill:bg-white selected:bg-white bg-white!'
                    inputParentDivClasses='h-full'
                    noLabel={true}
                    type='number'
                    numberMax={100}
                    step={0.01}
                    numberMin={0}
                    externalOnChange={(e) => {
                      if (!e) return;
                      const value = Number(e && e?.target.value);

                      if (value > 0 && /^[0][0-9]/.test(e.target.value)) {
                        e.target.value = value.toString().replace(/^0+/, '');
                      }

                      if (value > 100) e.target.value = '100';
                      if (value <= 0) e.target.value = '0';

                      if (props.hasCompletion == null) return;
                      const fee = getValues(`${props.fieldName}.${i}.fee`);
                      const updateTotal = fee * (Number(e?.target.value) / 100) || 0;
                      setValue(`${props.fieldName}.${i}.total`, updateTotal?.toFixed());
                    }}
                  />
                </div>
              ) : (
                <div className='col-span-12 flex items-center px-7 text-sm font-medium text-zinc-700 border-b border-r border-gray-100 relative'>
                  {Number(getValues(`${props.fieldName}.${i}.completion_percent`) || 0)?.toFixed(2)}
                  %
                </div>
              ))}

            {!props.isInShowMode ? (
              <div
                className={twMerge(
                  'col-span-17 flex items-center justify-center text-sm font-medium text-zinc-700 relative',
                  props.hasCompletion && 'col-span-12',
                )}
              >
                <div className=' absolute left-6 z-10'>{getCurrencySymbol(currency)}</div>
                <NormalInput
                  inputName={`${props.fieldName}.${i}.total`}
                  placeholder='Enter fee'
                  labelName='Fee'
                  className='hide-number-arrows h-full w-full border-gray-100! focus:ring-0 focus:border-gray-100 rounded-none border-l-0 border-r-0 pl-9 autofill:bg-white selected:bg-white bg-white!'
                  inputParentDivClasses='h-full'
                  noLabel={true}
                  type='number'
                  externalOnChange={(e) => {
                    if (props.hasCompletion == null) return;
                    const fee = getValues(`${props.fieldName}.${i}.fee`);
                    const updateCompletion = (Number(e?.target.value) / fee) * 100 || 0;
                    setValue(
                      `${props.fieldName}.${i}.completion_percent`,
                      updateCompletion?.toFixed(2),
                    );
                  }}
                />
              </div>
            ) : (
              <div
                className={twMerge(
                  'col-span-33 flex items-center px-7 text-sm font-medium text-zinc-700 border-b border-r border-gray-100 relative',
                  props.hasCompletion && 'col-span-24',
                )}
              >
                {getCurrencySymbol(currency)}
                {formatNumber(
                  formatCurrency(),
                  Number(getValues(`${props.fieldName}.${i}.total`) || 0),
                )}
              </div>
            )}
            <div
              className={twMerge(
                'col-span-10 w-full h-full flex items-center justify-end border border-gray-100',
              )}
            >
              <AdvancedSelect
                inputName={`${props.fieldName}.${i}.vat_id`}
                list={[
                  { id: '', title: 'N/A' },
                  ...(props.vats as { id: number; title: string }[]),
                ]}
                placeholder='N/A'
                inputClassName='bg-transparent! disabled:text-black border-none! px-6! text-sm! focus:ring-0! focus:outline-hidden! w-full h-full hover:bg-transparent! transition-none!'
                dropDownStyles='top-12! shadow-md'
                doNotLeavePlaceForError
                isTableCell
                canNotEdit={props.isInShowMode}
                onChangeHandler={(e) => {
                  setValue(
                    `${props.fieldName}.${i}.vat_amount`,
                    (e as unknown as { amount: number }).amount,
                  );
                }}
                noSearch
              />
            </div>
            {!props.isInShowMode && (
              <div
                className={twMerge(
                  'col-span-16 w-full h-full flex items-center justify-end border border-gray-100',
                  props.hasCompletion && 'col-span-12',
                )}
              >
                <button
                  className='rounded-full border border-gray-300 w-16 h-8 text-sm mr-6 hover:bg-red-700 hover:text-white'
                  onClick={(e) => removeField(e, i)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      {props.isInShowMode || !props.canAddField ? null : (
        <div
          className={`${
            !props.isInShowMode && 'pl-20'
          } col-span-50 grid w-full grid-cols-50 border border-t-0 border-gray-100 bg-white py-3.5 `}
        >
          <button
            type='button'
            onClick={addField}
            className='flex items-center space-x-2 whitespace-nowrap text-zinc-400'
          >
            <Plus color='#999DA5' />
            <span>Add a row</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceOtherExpenses;
