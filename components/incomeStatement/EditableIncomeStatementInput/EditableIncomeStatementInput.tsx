import { ChangeEvent } from 'react';
import { toFixedWithoutZeros } from './helpers';
import { Props } from './types';
import { useEditableIncomeStatementInput } from './useEditableIncomeStatementInput';
import { TickCircle, CloseCircle, LoaderIcon } from 'components';
import { allowOnlyNumbersInInputWithDot } from 'helpers';

const EditableIncomeStatementInput: React.FC<Props> = (props) => {
  const {
    register,
    navBtnIsOpen,
    divRef,
    toggleInput,
    getValues,
    value,
    setValue,
    previousValue,
    setPreviousValue,
  } = useEditableIncomeStatementInput(props.month, props.inputName);

  return (
    <div className='flex items-center relative  w-full' onClick={toggleInput}>
      <input
        {...register(`${props.inputName}.${props.month}.price`, {
          onChange(e: ChangeEvent<HTMLInputElement>) {
            const value = e.currentTarget.value;
            value &&
              setValue(`${props.inputName}.${props.month}.price`, toFixedWithoutZeros(value, 1));
            value && setValue(`${props.inputName}.${props.month}.price_without_formatting`, value);
          },
        })}
        className={`${props.inputClass} text-black outline-hidden placeholder:text-xs placeholder:text-zinc-400 bg-transparent`}
        placeholder={props.placeholder}
        value={value}
        disabled={
          props.isDisabled ||
          (!props.isOtherAdmin
            ? !getValues(`${props.inputName}.id`) || props.month === 13
            : !getValues(`${props.inputName}.id`) ||
              !getValues(`${props.inputName}.department_id`) ||
              props.month === 13)
        }
        onKeyDown={(e) => {
          return allowOnlyNumbersInInputWithDot(e);
        }}
      />
      {navBtnIsOpen && (
        <div className='flex gap-1 items-center' ref={divRef}>
          <button
            className={`${
              props.recordsSaving ? 'animate-spin' : 'animate-none'
            } ml-auto cursor-pointer z-30 disabled:cursor-not-allowed hover:opacity-50`}
            type='button'
            disabled={props.isDisabled || !getValues(`${props.inputName}.${props.month}.price`)}
            onClick={(event) => {
              event.stopPropagation();
              props.onSubmit(
                props.inputName,
                getValues(`${props.inputName}.${props.month}`),
                props.month,
                previousValue,
              );
              setPreviousValue({ ...getValues(`${props.inputName}.${props.month}`) });
            }}
          >
            {props.recordsSaving ? <LoaderIcon /> : <TickCircle />}
          </button>
          <button
            type='button'
            className='mr-2 cursor-pointer z-30g  disabled:cursor-not-allowed hover:opacity-50'
            disabled={
              props.isDisabled ||
              !getValues(`${props.inputName}.${props.month}.price`) ||
              !getValues(`${props.inputName}.${props.month}.id`)
            }
            onClick={() => {
              props.deleteExpenseRecordHandler(props.inputName, props.month);
            }}
          >
            <CloseCircle />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableIncomeStatementInput;
