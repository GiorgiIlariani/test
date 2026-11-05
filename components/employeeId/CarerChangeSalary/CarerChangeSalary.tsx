import { BasicSelect, InputWithOptionsOnRight, NormalInput, RadioWithLabel } from 'components';
import { CURRENCIES } from 'config';
import React from 'react';
import { useCarerChangeSalary } from './useCarerChangeSalary';
import { Props } from './types';
import { calculateSalaryChange } from './helpers';
import { ErrorMessage } from '@hookform/error-message';
import { Currency } from 'types';
import {
  allowOnlyNumbersInInputWithDot,
  capitalizeErrorMessage,
  convertNumbersAsPrice,
} from 'helpers';

const CarerChangeSalary: React.FC<Props> = (props) => {
  const {
    salary,
    currency,
    initiative,
    errors,
    currencyRates,
    getValues,
    paymentType,
    handleGrossSalaryChange,
    handleNetSalaryChange,
  } = useCarerChangeSalary(props.grossToNetMultiplier, props.disabled);

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-4'>
        <BasicSelect
          inputName='payment_type'
          labelName='Payment type *'
          list={['monthly', 'hourly']}
          placeholder='Enter payment type'
          noSearch={true}
          inputClassName='text-sm! capitalize bg-white'
          canNotEdit={props.disabled}
          registerOptions={{
            required: {
              message: 'Payment type is required',
              value: true,
            },
          }}
          labelClassName='block text-sm font-medium text-slate-900!'
          doNotLeavePlaceForError
        />
      </div>

      <div className='grid gap-2'>
        {props.disabled ? (
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <h2 className=' block font-medium text-slate-900! text-sm'>
                  Gross {paymentType === 'hourly' ? 'hourly salary *' : 'monthly salary *'}
                </h2>
                <div className='bg-gray-100 text-gray-600 h-10.5 pl-3 pr-6 border border-gray-300 rounded-md flex items-center justify-between'>
                  <p>{convertNumbersAsPrice(Number(getValues('salary') ?? 0), 2)}</p>
                  <span className='text-indigo-600 text-sm'>{getValues('currency')}</span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <h2 className=' block font-medium text-slate-900! text-sm'>
                  Net {paymentType === 'hourly' ? 'hourly salary' : 'monthly salary'}
                </h2>
                <div className='bg-gray-100 text-gray-600 h-10.5 pl-3 pr-6 border border-gray-300 rounded-md flex items-center justify-between'>
                  <p>
                    {convertNumbersAsPrice(
                      Number(getValues('salary') ?? 0) * Number(props.grossToNetMultiplier),
                      2,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <InputWithOptionsOnRight
                inputName='salary'
                labelName={`Gross ${paymentType === 'hourly' ? 'hourly' : 'monthly'} salary *`}
                placeholder='Enter paid amount'
                infoText={`Dependent on net ${
                  paymentType === 'hourly' ? 'hourly' : 'monthly'
                } salary and vice versa. Updating either value will automatically recalculate the other.`}
                selectName='currency'
                selectOptions={CURRENCIES}
                className='hide-number-arrows disabled:bg-gray-100 disabled:text-gray-600'
                type='text'
                wrapperClasses='h-10.5!'
                externalOnChange={handleGrossSalaryChange}
                externalKeyDownHandler={allowOnlyNumbersInInputWithDot}
                registerOptions={{
                  required: {
                    message: 'Salary is required',
                    value: true,
                  },
                  max: {
                    value: 40000,
                    message: 'Salary amount must not be greater than 40 000',
                  },
                  shouldUnregister: true,
                  validate: (value) => {
                    if (
                      value == props?.employee?.salary &&
                      getValues('currency') === props.employee?.salary?.currency
                    ) {
                      return 'New salary can not be same as old one';
                    }
                    return true;
                  },
                  deps: ['currency'],
                }}
                canNotEdit={props.disabled}
                doNotLeavePlaceForError
              />

              {((props.salaryAttributes?.percentage !== undefined &&
                props.salaryAttributes?.percentage !== null) ||
                !props.salaryAttributes) && (
                <span className='grid self-end mb-2.75 -ml-1'>
                  {!props.disabled ? (
                    (() => {
                      const salaryChange = calculateSalaryChange(
                        salary,
                        props.oldSalary,
                        currency,
                        currencyRates,
                        props.oldCurrency as Currency,
                        paymentType,
                        props.oldPaymentType,
                        props.defaultCurrency,
                      );

                      if (!salaryChange) return null;

                      return (
                        <span
                          className={`text-sm font-medium ${
                            salaryChange.type === 'increase'
                              ? 'text-success'
                              : salaryChange.type === 'decrease'
                              ? 'text-destructive'
                              : ''
                          }`}
                        >
                          {salaryChange.formattedValue}
                        </span>
                      );
                    })()
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        props.salaryAttributes?.percentage === 0
                          ? 'text-slate-900'
                          : props.salaryAttributes?.increase
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {props.salaryAttributes?.percentage === 0
                        ? `${props.salaryAttributes?.percentage}%`
                        : `${props.salaryAttributes?.increase ? '+' : '-'}${Math.abs(
                            props.salaryAttributes?.percentage as number,
                          )}%`}
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <NormalInput
                inputName='net_salary'
                labelName={`Net ${paymentType === 'hourly' ? 'hourly' : 'monthly'} salary`}
                placeholder='Enter net amount'
                infoText={`Dependent on gross ${
                  paymentType === 'hourly' ? 'hourly' : 'monthly'
                } salary and vice versa. Updating either value will automatically recalculate the other.`}
                labelClasses='leading-[calc(1.25/0.875)]!'
                className='hide-number-arrows text-base bg-white disabled:bg-gray-100 disabled:text-gray-600 h-10.5'
                type='text'
                externalOnChange={handleNetSalaryChange}
                externalKeyDown={allowOnlyNumbersInInputWithDot}
                canNotEdit={props.disabled}
                doNotLeavePlaceForError
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <span className='text-slate-900 text-left block'>Initiative *</span>
        <div className='flex space-x-4'>
          <RadioWithLabel
            inputName='meta.initiative'
            label='Counter offer'
            value='counter_offer'
            wrapperClasses='w-auto!'
            registerOptions={{
              required: {
                message: 'Initiative is required',
                value: true,
              },
              shouldUnregister: true,
            }}
            canNotEdit={props.disabled}
          />
          <RadioWithLabel
            inputName='meta.initiative'
            label='Proactive'
            value='proactive'
            wrapperClasses='w-auto!'
            registerOptions={{
              required: {
                message: 'Initiative is required',
                value: true,
              },
              shouldUnregister: true,
            }}
            canNotEdit={props.disabled}
          />
          <RadioWithLabel
            inputName='meta.initiative'
            label='Requested by employee'
            value='request_by_employee'
            wrapperClasses='w-auto!'
            registerOptions={{
              required: {
                message: 'Initiative is required',
                value: true,
              },
              shouldUnregister: true,
            }}
            canNotEdit={props.disabled}
          />
          <RadioWithLabel
            inputName='meta.initiative'
            label='Other'
            value='other'
            wrapperClasses='w-auto!'
            registerOptions={{
              required: {
                message: 'Initiative is required',
                value: true,
              },
              shouldUnregister: true,
            }}
            canNotEdit={props.disabled}
          />
        </div>

        {initiative !== 'other' && (errors.meta as any)?.initiative && (
          <div className={`text-left text-2xs text-red-500 min-h-5`}>
            <ErrorMessage render={capitalizeErrorMessage} name='meta.initiative' errors={errors} />
          </div>
        )}
      </div>

      {initiative === 'other' && !props.disableOtherReason && (
        <div className='w-[calc(50%-0.5rem)]'>
          <NormalInput
            inputName='salary_change_reason'
            labelName=''
            noLabel={true}
            placeholder='Enter salary update reason'
            type='text'
            className='mt-4  block'
            registerOptions={{
              required: {
                message: 'Salary update reason is required',
                value: true,
              },

              shouldUnregister: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CarerChangeSalary;
