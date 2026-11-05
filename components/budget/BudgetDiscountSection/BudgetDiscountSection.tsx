'use client';

import { FreeOfChargeToggle } from 'components/addProject';
import { SwitchIcon, TransformedInput } from 'components';
import {
  allowOnlyNumbersInInputWithDot,
  analytics,
  getCurrencySymbol,
  onDiscountAmountChange,
  onDiscountChange,
  onDiscountTurnOffToggle,
} from 'helpers';
import { Props } from './types';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PhasesForm } from 'types';

const BudgetDiscountSection: React.FC<Props> = (props) => {
  const { control, setValue, getValues } = useFormContext();
  const discount_toggle = useWatch({ name: `${props.inputName}.discount_toggle`, control });
  const budgetTotal = (getValues(`${props.inputName}.employees`) as PhasesForm['employees'])
    ?.filter((item) => !!!item.is_free_of_charge)
    ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0);

  return (
    <section className='mt-[2.063rem] mb-[0.563rem]'>
      {props.isReadOnly || (
        <div className='flex items-center gap-2.5 '>
          <FreeOfChargeToggle
            inputName={`${props.inputName}.discount_toggle`}
            onChangeHandler={(e) => {
              !e.currentTarget?.checked &&
                props.updateOnBlurHandler((setValue) => {
                  onDiscountTurnOffToggle(setValue, props.phaseIndex!);
                }, true);
              analytics.track(
                `Discount toggle - ${!e.currentTarget?.checked ? 'checked' : 'unchecked'}`,
              );
            }}
            showProject={props.isReadOnly}
          />
          <p className='text-sm text-[#5A636F] font-medium'>Discount</p>
        </div>
      )}

      {!discount_toggle || (
        <div className='flex items-center gap-2.5 mt-2.5 text-sm text-zinc-700'>
          {props.isReadOnly && <p className='text-zinc-700 text-sm font-medium pr-3'>Discount</p>}
          <div
            className={`${
              props.isReadOnly ? 'text-[#5A636F]! w-16' : 'border border-zinc-160 w-23.5'
            }  px-2.5 h-9.5 relative py-2 bg-gray-50  rounded-md`}
          >
            %
            <TransformedInput
              inputName={`${props.inputName}.discount`}
              blurHandler={() => {
                props.updateOnBlurHandler((setValue, terms) => {
                  onDiscountChange(setValue, props.phaseIndex!, terms);
                }, true);
                analytics.track('Phase discount percentage');
              }}
              className='border-none! outline-hidden! !-px-2 pt-0.5 w-16! truncate focus:border-transparent focus:ring-0 bg-transparent! placeholder:text-zinc-200'
              containerClasses='!absolute top-[0.35rem] w-16 left-7'
              externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
              isFormUpdated={props.budgetIsUpdated}
              externalOnChange={(e) => {
                const value = e?.target.value as unknown as number;
                if (value! > 100) {
                  setValue(`${props.inputName}.discount`, 100);
                }
              }}
              canNotEdit={props.isReadOnly}
              externalButtonClassName={`${props.isReadOnly ? 'text-[#5A636F]' : ''}`}
            />
          </div>
          <SwitchIcon />
          <div
            className={`${
              props.isReadOnly ? 'text-[#5A636F]! w-24' : 'border border-zinc-160 w-32'
            } px-2.5  relative h-9.5 py-2 bg-gray-50 rounded-md`}
          >
            {getCurrencySymbol(props.currency)}
            <TransformedInput
              inputName={`${props.inputName}.discount_amount`}
              blurHandler={() => {
                const discount =
                  (+getValues(`${props.inputName}.discount_amount`)! / budgetTotal) * 100;
                setValue(`${props.inputName}.discount`, discount > 100 ? 100 : discount);
                props.updateOnBlurHandler((setValue, terms) => {
                  onDiscountAmountChange(setValue, props.phaseIndex!, terms);
                }, true);
                analytics.track('Phase discount amount');
              }}
              className='border-none! outline-hidden! w-[5.8rem] !-px-2 pt-0.5 focus:border-transparent focus:ring-0 bg-transparent! placeholder:text-zinc-200'
              containerClasses='!absolute top-[0.35rem] left-6'
              externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
              externalOnChange={(e) => {
                const value = e?.target.value as unknown as number;
                if (value! >= budgetTotal) {
                  setValue(`${props.inputName}.discount_amount`, budgetTotal);
                  setValue(`${props.inputName}.discount`, 100);
                }
              }}
              isFormUpdated={props.budgetIsUpdated}
              canNotEdit={props.isReadOnly}
              externalButtonClassName={`${props.isReadOnly ? 'text-[#5A636F]' : ''}`}
            />
          </div>
        </div>
      )}
    </section>
  );
};
export default BudgetDiscountSection;
