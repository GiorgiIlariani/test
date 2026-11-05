import {
  ActionChoiceCheckbox,
  NormalInput,
  CarerChangeSalary,
  ActionsModalWrapper,
  AdvancedSelect,
  BasicSelect,
} from 'components';
import {
  getFormattedDate,
  validateRequiredFieldForBlank,
  validateThatCareerIsNotRepeated,
  validateThatDateIsSane,
  validateThatEmployeeDoesNotHaveOnDemandAvailability,
} from 'helpers';
import React from 'react';
import { startOfDay, isBefore } from 'date-fns';
import { FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useCarerChange } from './useCarerChange';

const CarerChange: React.FC<Props> = (props) => {
  const {
    form,
    informationStepIsOpen,
    nextStepHandler,
    types,
    seniorities,
    positions,
    departments,
    handlePreviousStep,
    loading,
    defaultCurrency,
    grossToNetMultiplier,
  } = useCarerChange(
    props.toggleModal,
    props.userId,
    props.setActionsAreAdded,
    props.employee,
    props.refetchEmployees,
    props.defaultDate,
    props.isInBudgetView,
  );

  return (
    <FormProvider {...form}>
      <ActionsModalWrapper
        title={
          !informationStepIsOpen
            ? 'Career Changes'
            : types?.join(', ').replace('_', ' ').replace('Job type', 'Employment type')
        }
        submitButtonText={informationStepIsOpen ? 'Save' : 'Next'}
        secondaryButtonText={
          !informationStepIsOpen && props.previousButtonText
            ? props.previousButtonText
            : informationStepIsOpen
            ? 'Previous'
            : 'Cancel'
        }
        secondaryButtonHandler={
          !informationStepIsOpen && props.previousStepHandler
            ? props.previousStepHandler
            : handlePreviousStep
        }
        submitButtonDisabled={!!!types.length}
        submitButtonHandler={nextStepHandler}
        onClose={props.toggleModal}
        loading={loading}
        titleSuffix={props.titleSuffix}
      >
        {!informationStepIsOpen ? (
          <>
            <div className='grid w-full p-6 grid-cols-2 gap-4'>
              <ActionChoiceCheckbox label='Seniority' name='type' value='Seniority' />
              <ActionChoiceCheckbox label='Department' name='type' value='Department' />
              <ActionChoiceCheckbox label='Salary' name='type' value='Salary' />
              <ActionChoiceCheckbox label='Job title' name='type' value='Position' />
              <ActionChoiceCheckbox label='Availability' name='type' value='Availability' />
              <ActionChoiceCheckbox label='Employment type' name='type' value='Job type' />
            </div>
          </>
        ) : (
          <>
            <div className='p-6 flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date *'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-slate-900!'
                  registerOptions={{
                    required: {
                      message: 'Start date is required',
                      value: true,
                    },
                    validate: {
                      dateIsSane: (v) => validateThatDateIsSane(v),
                      compareJoinDate: (v) => {
                        const selectedDate = startOfDay(new Date(v));
                        const joinDate = startOfDay(
                          new Date(props.joinDate ?? props.employee.join_date),
                        );

                        return (
                          !isBefore(selectedDate, joinDate) ||
                          `Employee started working in ${getFormattedDate(
                            props.joinDate ?? props.employee.join_date,
                          )}`
                        );
                      },
                    },
                  }}
                  doNotLeavePlaceForError
                />
                <BasicSelect
                  inputName='status'
                  labelName='Status *'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>

              {(types.includes('Position') || types.includes('Seniority')) && (
                <div className='flex gap-4'>
                  {types.includes('Position') && (
                    <div className='w-[calc(50%-0.5rem)]'>
                      <AdvancedSelect
                        inputName={'position_id'}
                        labelName='Job title *'
                        list={positions}
                        placeholder='Enter new job title'
                        registerOptions={{
                          required: {
                            message: 'New job title is required',
                            value: true,
                          },
                          validate: {
                            blank: (value) => validateRequiredFieldForBlank(value, 'New position'),
                            duplicate: (value) => {
                              if (
                                value == props.employee.position.id &&
                                (!form.getValues('department_id') ||
                                  props.employee.department.id == form.getValues('department_id'))
                              ) {
                                return 'New job title can not be same as old one';
                              }
                              return true;
                            },
                          },
                        }}
                        doNotLeavePlaceForError
                      />
                    </div>
                  )}
                  {types.includes('Seniority') && (
                    <div className='w-[calc(50%-0.5rem)]'>
                      <AdvancedSelect
                        inputName={'seniority_id'}
                        labelName='Seniority *'
                        list={seniorities}
                        placeholder='Enter new seniority'
                        registerOptions={{
                          required: {
                            message: 'New seniority is required',
                            value: true,
                          },
                          validate: {
                            blank: (value) => validateRequiredFieldForBlank(value, 'New seniority'),
                            duplicate: (value) => {
                              if (
                                value == props.employee.seniority.id &&
                                (!form.getValues('position_id') ||
                                  props.employee.position.id === form.getValues('position_id')) &&
                                (!form.getValues('department_id') ||
                                  props.employee.department.id == form.getValues('department_id'))
                              ) {
                                return 'New Seniority can not be same as old one';
                              }
                              return true;
                            },
                          },
                          deps: ['position_id'],
                        }}
                        doNotLeavePlaceForError
                      />
                    </div>
                  )}
                </div>
              )}

              {types.includes('Department') && (
                <div className='w-[calc(50%-0.5rem)]'>
                  <AdvancedSelect
                    inputName={'department_id'}
                    labelName='Department *'
                    list={departments}
                    placeholder='Enter new department'
                    registerOptions={{
                      required: {
                        message: 'New team is required',
                        value: true,
                      },
                      validate: {
                        blank: (value) => {
                          return validateRequiredFieldForBlank(value, 'New department');
                        },
                        duplicate: (value) => {
                          if (value == props.employee.department.id) {
                            return 'New Department can not be same as old one';
                          }
                          return true;
                        },
                      },
                      deps: ['position_id', 'seniority_id'],
                    }}
                    doNotLeavePlaceForError
                  />
                </div>
              )}
              {types.includes('Availability') && (
                <div className='w-[calc(50%-0.5rem)]'>
                  <BasicSelect
                    inputName='availability'
                    labelName='Availability *'
                    list={['Full-time', 'Part-time', 'On-demand']}
                    placeholder='Enter availability'
                    noSearch={true}
                    inputClassName='text-sm! capitalize'
                    onChangeHandler={() => form.getValues('job_type') && form.trigger('job_type')}
                    registerOptions={{
                      required: {
                        message: 'Availability is required',
                        value: true,
                      },
                      validate: {
                        notRepeated: (availability) =>
                          validateThatCareerIsNotRepeated(
                            availability,
                            props.careerLog,
                            'Availability',
                            form.getValues('date'),
                          ),
                        doesNotHaveOnDemand: (availability) =>
                          validateThatEmployeeDoesNotHaveOnDemandAvailability(
                            availability,
                            form.getValues('job_type'),
                          ),
                      },
                    }}
                    doNotLeavePlaceForError
                  />
                </div>
              )}
              {types.includes('Job type') && (
                <div className='w-[calc(50%-0.5rem)]'>
                  <BasicSelect
                    inputName={'job_type'}
                    labelName={`Employment type`}
                    list={['employee', 'freelancer']}
                    placeholder='Choose employment type'
                    onChangeHandler={() =>
                      form.getValues('availability') && form.trigger('availability')
                    }
                    registerOptions={{
                      required: 'Employment type is required',
                      validate: {
                        notRepeated: (jobType) =>
                          validateThatCareerIsNotRepeated(
                            jobType,
                            props.careerLog,
                            'Job type',
                            form.getValues('date'),
                          ),
                        doesNotHaveOnDemand: (jobType) =>
                          validateThatEmployeeDoesNotHaveOnDemandAvailability(
                            form.getValues('availability'),
                            jobType,
                          ),
                      },
                    }}
                    inputClassName='text-sm! capitalize'
                    noSearch={true}
                    doNotLeavePlaceForError
                  />
                </div>
              )}
              {types.includes('Salary') && (
                <CarerChangeSalary
                  oldCurrency={props.employee.salary?.currency ?? 'USD'}
                  employee={props.employee}
                  oldSalary={props.employee.salary.salary ?? 0}
                  oldPaymentType={props.employee.salary?.payment_type}
                  defaultCurrency={defaultCurrency}
                  grossToNetMultiplier={grossToNetMultiplier}
                />
              )}
            </div>
          </>
        )}
      </ActionsModalWrapper>
    </FormProvider>
  );
};

export default CarerChange;
