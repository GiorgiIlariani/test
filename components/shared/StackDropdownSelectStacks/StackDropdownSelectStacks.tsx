import { ErrorMessage } from '@hookform/error-message';
import { ExclamationCircle, TrashCan } from 'components/icons';
import { COMPETENCY_RATES } from 'config';
import {
  allowOnlyNumbersInInput,
  capitalizeErrorMessage,
  getErrorMessage,
  modifySkillInACookie,
} from 'helpers';
import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { AdvancedSelect } from 'components';
import { Props } from './types';

const StackDropdownSelectStacks: React.FC<Props> = (props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className='flex flex-col'>
      <div className='grid grid-flow-col auto-rows-fr grid-cols-5  content-center items-start border-b border-gray-200 pt-6 pb-4'>
        <span className='col-span-1 text-xs uppercase text-gray-500'>{props.dropdownLabel}</span>
        {!props.doesNotNeedExperience && (
          <span className='col-span-2 w-full text-xs uppercase text-gray-500'>Experience</span>
        )}
        {!props.doesNotNeedCompetency && (
          <span className='align-start col-span-1 w-full text-xs uppercase text-gray-500'>
            Competence rate
          </span>
        )}
        {!props.doesNotNeedPreferred && (
          <span className='col-span-1 w-full pl-12 text-xs uppercase text-gray-500'>
            Preferred stack
          </span>
        )}
      </div>
      {props.selectedStack.map((stack, i) => {
        const experienceError = getErrorMessage(
          errors,
          `${props.dropdownCategory}.${i}.experience_duration`,
        );
        return (
          <div
            key={stack.id}
            className={`relative grid grid-flow-col auto-rows-fr grid-cols-5  content-center items-start border-b border-gray-200`}
          >
            <span className='col-span-1 my-6 self-center text-gray-500'>
              {props.selectedStack[i].title}
            </span>
            {!props.doesNotNeedExperience && (
              <div className='col-span-2 flex h-full  w-full flex-col items-start justify-start pt-6'>
                <div id='experience' className='flex'>
                  <div className='relative  flex justify-start rounded-md'>
                    <input
                      type='number'
                      id='years'
                      min={0}
                      disabled={props.canNotEdit}
                      defaultValue={0}
                      {...register(
                        `${props.dropdownCategory}.${stack.localId}.years_of_experience`,
                        {
                          max: { value: 255, message: 'Maximum number is 255' },
                          onChange: (e: ChangeEvent) => {
                            props.allInputsChangeHandler && props.allInputsChangeHandler(e);
                            if (props.needsDraft) {
                              modifySkillInACookie(
                                props.dropdownCategory,
                                {
                                  ...stack,
                                  years_of_experience: (e.currentTarget as HTMLInputElement).value,
                                },
                                'add-employee',
                                'years_of_experience',
                                false,
                              );
                            }
                          },
                        },
                      )}
                      onKeyDown={allowOnlyNumbersInInput}
                      className={`py-2.5 focus:ring-indigo-500 ${
                        experienceError &&
                        'border-red-300 shadow-red-500 outline-0 focus:border-transparent focus:shadow-xs focus:ring-2 focus:ring-red-500'
                      } block w-[75%] rounded-md border-gray-300 pr-12 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm`}
                    />
                    <div className='pointer-events-none absolute inset-y-0 left-[70%] flex -translate-x-full items-center'>
                      {experienceError ? (
                        <ExclamationCircle />
                      ) : (
                        <span className='text-gray-500 sm:text-sm'>Years</span>
                      )}
                    </div>
                  </div>
                  <div className='relative  flex justify-start rounded-md'>
                    <input
                      type='number'
                      id='months'
                      min={0}
                      disabled={props.canNotEdit}
                      defaultValue={0}
                      {...register(
                        `${props.dropdownCategory}.${stack.localId}.months_of_experience`,
                        {
                          onChange: (e: ChangeEvent) => {
                            props.allInputsChangeHandler && props.allInputsChangeHandler(e);
                            if (props.needsDraft) {
                              modifySkillInACookie(
                                props.dropdownCategory,
                                {
                                  ...stack,
                                  months_of_experience: (e.currentTarget as HTMLInputElement).value,
                                },
                                'add-employee',
                                'months_of_experience',
                                false,
                              );
                            }
                          },
                        },
                      )}
                      onKeyDown={allowOnlyNumbersInInput}
                      className={`focus:ring-indigo-500 ${
                        experienceError &&
                        'border-red-300 shadow-red-500 outline-0 focus:border-transparent focus:shadow-xs focus:ring-2 focus:ring-red-500'
                      } block w-[75%] rounded-md border-gray-300 pr-16 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm`}
                    />
                    <div className='pointer-events-none absolute inset-y-0 left-[70%] flex -translate-x-full items-center'>
                      {experienceError ? (
                        <ExclamationCircle />
                      ) : (
                        <span className='text-gray-500 sm:text-sm'>Months</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='mb-1 min-h-6 text-xs text-red-500'>
                  <ErrorMessage
                    name={`${props.dropdownCategory}.${i}.experience_duration`}
                    render={capitalizeErrorMessage}
                    errors={errors}
                  />
                  <ErrorMessage
                    name={`${props.dropdownCategory}.${stack.localId}.years_of_experience`}
                    render={capitalizeErrorMessage}
                    errors={errors}
                  />
                </div>
              </div>
            )}
            {!props.doesNotNeedCompetency && (
              <div className='col-span-1 mb-6 flex h-full flex-col'>
                <AdvancedSelect
                  inputName={`${props.dropdownCategory}.${stack.localId}.competency_rate`}
                  list={COMPETENCY_RATES}
                  placeholder='Competency rate'
                  onChangeHandler={(e) => {
                    if (props.needsDraft) {
                      modifySkillInACookie(
                        props.dropdownCategory,
                        {
                          ...stack,
                          competency_rate: +e?.id,
                        },
                        'add-employee',
                        'competency_rate',
                        false,
                      );
                    }
                  }}
                />
              </div>
            )}
            {!props.doesNotNeedPreferred && (
              <label
                htmlFor={`primary-toggle-${stack.localId}`}
                className='relative col-span-1 mt-6 mb-6 ml-12 h-[16px] w-[35px] select-none self-center justify-self-start rounded-2xl bg-gray-200'
              >
                <input
                  {...register(`${props.dropdownCategory}.${stack.localId}.is_preferred`, {
                    onChange: (e: ChangeEvent) => {
                      props.allInputsChangeHandler && props.allInputsChangeHandler(e);
                      if (props.needsDraft) {
                        modifySkillInACookie(
                          props.dropdownCategory,
                          {
                            ...stack,
                            is_preferred: (e.currentTarget as HTMLInputElement).value,
                          },
                          'add-employee',
                          'is_preferred',
                          false,
                        );
                      }
                    },
                  })}
                  id={`primary-toggle-${stack.localId}`}
                  disabled={props.canNotEdit}
                  className='peer hidden'
                  type='checkbox'
                />
                <div className='transition-150-ease-in h-full w-full rounded-2xl peer-checked:bg-violet-600'></div>
                <div className='transition-150-ease-in absolute left-0 -top-[10%] h-[20px] w-[20px] rounded-full border border-gray-200 bg-white shadow-2xl peer-checked:left-full peer-checked:-translate-x-full'></div>
              </label>
            )}
            {!props.canNotEdit && (
              <button
                type='button'
                onClick={() => {
                  props.allInputsChangeHandler && props.allInputsChangeHandler();
                  props.deleteHandler(props.selectedStack[i]);
                }}
                className={`transition-150-ease-in absolute  top-1/2 right-0 flex h-8 w-8   -translate-y-1/2 items-center justify-center rounded-md bg-indigo-600 shadow-xs hover:bg-indigo-700 focus:ring-3 focus:ring-indigo-700 focus:ring-offset-2`}
              >
                <TrashCan className='' color='white' />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StackDropdownSelectStacks;
