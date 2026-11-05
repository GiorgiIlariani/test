import { Props } from './types';
import React from 'react';
import { useCounterInput } from './useCounterInput';
import { ErrorMessage } from '@hookform/error-message';
import { allowOnlyNumbersInInput, capitalizeErrorMessage } from 'helpers';

const CounterInput: React.FC<Props> = (props) => {
  const { register, errors, counterHandler } = useCounterInput(props.inputName);
  return (
    <div className='relative'>
      <input
        {...register(`${props.inputName}`, {
          ...props.registerOptions,
        })}
        type='text'
        className={`${props.className} border-zinc-200 focus:border-none focus:ring-indigo-600 rounded-md w-full h-10`}
        placeholder={props.placeholder}
        disabled={props.canNotEdit}
        onKeyDown={(e) => allowOnlyNumbersInInput(e)}
      />
      {!props.canNotEdit && (
        <div className='absolute top-1 right-4 flex gap-2 text-xl text-[#212328] placeholder:text-zinc-400'>
          <p className='cursor-pointer' onClick={() => counterHandler('-')}>
            -
          </p>
          <p className='cursor-pointer' onClick={() => counterHandler('+')}>
            +
          </p>
        </div>
      )}

      <div className='mb-2 h-4 pl-1 min-h-4 text-left text-xs text-red-500'>
        <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
      </div>
    </div>
  );
};

export default CounterInput;
