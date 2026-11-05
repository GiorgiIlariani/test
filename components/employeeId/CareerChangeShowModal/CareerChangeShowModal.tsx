import {
  NormalInput,
  ActionsModalWrapper,
  CarerChangeSalary,
  CareerChangeShowModalCTA,
  ProjectTable,
  SkeletonLoaders,
  TerminationShowModal,
  AdvancedSelect,
  BasicSelect,
} from 'components';
import React from 'react';
import { startOfDay, isBefore } from 'date-fns';
import { useCareerChangeShowModal } from './useCareerChangeShowModal';
import { Props } from './types';
import { CareerLogDetail } from 'types';
import {
  formatDate,
  getFormattedDate,
  validateRequiredFieldForBlank,
  validateThatCareerIsNotRepeated,
  validateThatDateIsSane,
  validateThatEmployeeDoesNotHaveOnDemandAvailability,
} from 'helpers';

const CareerChangeShowModal: React.FC<Props> = (props) => {
  const {
    form,
    positions,
    getCareerLogModalTitle,
    initiatives,
    seniorities,
    departments,
    grossToNetMultiplier,
    oldSalaryInfo,
    isFirstLog,
  } = useCareerChangeShowModal(
    props.logDetailedInfo as CareerLogDetail,
    props.getOldSalaryInfoHandler,
    props.employee,
    props.careerLog,
  );

  return (
    <ActionsModalWrapper
      title={
        props.currentCareerLog.includes('boarded')
          ? `${
              props.currentCareerLog === 'On boarded' ? 'Onboarded' : 'Offboarded'
            } on ${form.getValues('employee.project')}`
          : `${getCareerLogModalTitle(props.currentCareerLog)} Update`
      }
      subtitle={
        props.logDetailIsLoading ? (
          <div className='h-5 w-60 rounded-md bg-gray-300 animate-pulse' />
        ) : (
          `Updated by ${props.logDetailedInfo?.changed_by?.name ?? 'unknown'} • ${formatDate(
            props.logDetailedInfo?.created_at!,
          )}`
        )
      }
      onClose={props.closeLogInfoHandler}
      submitButtonHandler={(data) => props.editCareerLogHandler(data)}
      secondaryButtonText={'Cancel'}
      secondaryButtonHandler={() => {
        props.cancelCareerEditChanges(+props.logDetailedInfo?.id!);
        props.setLogIsInEditMode(false);
      }}
      submitButtonText='Save'
      submitButtonDisabled={
        !!form.formState.errors.position?.message ||
        !!form.formState.errors.department?.message ||
        !!form.formState.errors.seniority?.message ||
        props.logDetailIsLoading
      }
      disableButtons={!props.logIsInEditMode || props.logDetailIsLoading}
    >
      <div className='p-6'>
        {props.currentCareerLog.includes('Salary') &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Salary'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600'}
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
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>
              <CarerChangeSalary
                disabled={!props.logIsInEditMode}
                disableOtherReason={
                  !initiatives.includes(props.logDetailedInfo?.data.meta?.initiative as string)
                }
                salaryAttributes={{
                  increase: props.logDetailedInfo?.data.meta?.increase as boolean,
                  percentage: props.logDetailedInfo?.data.meta?.percentage as number,
                }}
                oldSalary={
                  oldSalaryInfo.oldSalary
                    ? +oldSalaryInfo.oldSalary
                    : Number(props.employee?.salary?.salary) ?? 0
                }
                oldCurrency={
                  oldSalaryInfo.oldCurrency
                    ? oldSalaryInfo.oldCurrency
                    : props.employee.salary?.currency ?? 'USD'
                }
                oldPaymentType={
                  oldSalaryInfo.oldPaymentType
                    ? oldSalaryInfo.oldPaymentType
                    : props.employee.salary?.payment_type ?? 'monthly'
                }
                defaultCurrency={props.defaultCurrency}
                grossToNetMultiplier={grossToNetMultiplier}
              />{' '}
            </div>
          ))}
        {props.currentCareerLog === 'Position' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600'}
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
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <AdvancedSelect
                  inputName={'position'}
                  labelName='Job title'
                  list={positions}
                  placeholder='Enter new job title'
                  registerOptions={{
                    validate: {
                      blank: (value) => validateRequiredFieldForBlank(value, 'New position'),
                    },
                  }}
                  canNotEdit={!props.logIsInEditMode}
                  doNotLeavePlaceForError
                />
              </div>
            </div>
          ))}

        {props.currentCareerLog === 'Availability' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600 '}
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
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <BasicSelect
                  inputName='availability'
                  labelName='Availability'
                  list={['Full-time', 'Part-time', 'On-demand']}
                  placeholder='Enter availability'
                  noSearch={true}
                  inputClassName='text-sm!'
                  canNotEdit={!props.logIsInEditMode}
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
                          props.logDetailedInfo,
                        ),
                      doesNotHaveOnDemand: (availability) =>
                        validateThatEmployeeDoesNotHaveOnDemandAvailability(
                          availability,
                          form.getValues('job_type') ?? props.logDetailedInfo?.data?.job_type,
                        ),
                    },
                  }}
                  doNotLeavePlaceForError
                />
              </div>
            </div>
          ))}

        {props.currentCareerLog === 'Job type' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600 '}
                  registerOptions={{
                    required: {
                      message: 'Start date is required',
                      value: true,
                    },
                    validate: {
                      notRepeated: (jobType) =>
                        validateThatCareerIsNotRepeated(
                          jobType,
                          props.careerLog,
                          'Job type',
                          form.getValues('date'),
                          props.logDetailedInfo,
                        ),
                      doesNotHaveOnDemand: (jobType) =>
                        validateThatEmployeeDoesNotHaveOnDemandAvailability(
                          form.getValues('availability') ?? props.logDetailedInfo?.data?.job_type,
                          jobType,
                        ),
                    },
                  }}
                  doNotLeavePlaceForError
                />
                <BasicSelect
                  inputName='status'
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <BasicSelect
                  inputName={'job_type'}
                  labelName={`Employment type`}
                  list={['employee', 'freelancer']}
                  placeholder='Choose employment type'
                  noSearch={true}
                  inputClassName='text-sm! capitalize'
                  canNotEdit={!props.logIsInEditMode}
                  registerOptions={{
                    required: {
                      message: 'Employment type is required',
                      value: true,
                    },
                    validate: {
                      notRepeated: (jobType) =>
                        validateThatCareerIsNotRepeated(
                          jobType,
                          props.careerLog,
                          'Job type',
                          form.getValues('date'),
                          props.logDetailedInfo,
                        ),
                      doesNotHaveOnDemand: (jobType) =>
                        validateThatEmployeeDoesNotHaveOnDemandAvailability(
                          form.getValues('availability') ??
                            props.logDetailedInfo?.data?.availability,
                          jobType,
                        ),
                    },
                  }}
                  doNotLeavePlaceForError
                />
              </div>
            </div>
          ))}

        {props.currentCareerLog === 'Department' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600 '}
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
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <AdvancedSelect
                  inputName={'department'}
                  labelName='Department'
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
                    },
                  }}
                  canNotEdit={!props.logIsInEditMode}
                  doNotLeavePlaceForError
                />
              </div>
            </div>
          ))}
        {props.currentCareerLog === 'Seniority' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <NormalInput
                  inputName='date'
                  labelName='Start date'
                  placeholder='Start date'
                  type='date'
                  labelClasses='text-gray-700'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  disabledClasses={'disabled:bg-gray-100 text-gray-600'}
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
                  labelName='Status'
                  list={['active', 'draft']}
                  inputClassName='capitalize'
                  dropDownStyles='top-[4.5rem]'
                  canNotEdit={!props.logIsInEditMode || isFirstLog}
                  noSearch
                  doNotLeavePlaceForError
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <AdvancedSelect
                  inputName={'seniority'}
                  labelName='Seniority'
                  list={seniorities}
                  placeholder='Enter new seniority'
                  registerOptions={{
                    required: {
                      message: 'New seniority is required',
                      value: true,
                    },
                    validate: {
                      blank: (value) => validateRequiredFieldForBlank(value, 'New seniority'),
                    },
                  }}
                  canNotEdit={!props.logIsInEditMode}
                  doNotLeavePlaceForError
                />
              </div>
            </div>
          ))}
        {props.currentCareerLog === 'Re-employed' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Other'} />
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              <NormalInput
                inputName='date'
                labelName='Start date'
                placeholder='Start date'
                type='date'
                labelClasses='text-gray-700'
                canNotEdit={!props.logIsInEditMode}
                disabledClasses={'disabled:bg-gray-100 text-gray-600'}
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
                canNotEdit={!props.logIsInEditMode}
                noSearch
                doNotLeavePlaceForError
              />
            </div>
          ))}
        {props.currentCareerLog.includes('boarded') && (
          <ProjectTable logDetailIsLoading={props.logDetailIsLoading} />
        )}
        {props.currentCareerLog === 'Termination' &&
          (props.logDetailIsLoading ? (
            <SkeletonLoaders type={'Termination'} />
          ) : (
            <TerminationShowModal
              logIsInEditMode={props.logIsInEditMode}
              logDetailedInfo={props.logDetailedInfo}
            />
          ))}
      </div>

      {!props.logIsInEditMode && (
        <CareerChangeShowModalCTA
          currentCareerLog={props.currentCareerLog}
          openDeleteLogModalHandler={props.openDeleteLogModalHandler}
          setLogIsInEditMode={props.setLogIsInEditMode}
          logIsInEditMode={props.logIsInEditMode}
          employee={props.employee}
          displayPreviousButton={props.displayPreviousButton}
          previousButtonHandler={props.secondaryButtonHandler}
          previousButtonText={props.secondaryButtonText}
          isLoading={props.logDetailIsLoading}
        />
      )}
    </ActionsModalWrapper>
  );
};

export default CareerChangeShowModal;
