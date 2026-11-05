import {
  Plus,
  EmployeeTotal,
  FreeOfChargeToggle,
  InputWithFollowingSignAtEnd,
  RateInput,
  EngagementWithSelect,
  StaffVacation,
  StaffingErrorModal,
  Table,
  AdvancedSelect,
} from 'components';
import { CURRENCY_SYMBOL_REGEX, getCurrencySymbol, getErrorMessage } from 'helpers';
import { Currency, Staff } from 'types';
import { EmployeeButtonTextRendered, EmployeesListOptionRenderer } from './helpers';
import { Props } from './types';
import { useStaffingAndTerms } from './useStaffingAndTerms';
import { twMerge } from 'tailwind-merge';
import StaffingVacationInfo from './VacationInfo';
import { ErrorMessage } from '@hookform/error-message';

const StaffingAndTerms: React.FC<Props> = (props) => {
  const {
    fields,
    addNewTerm,
    removeTerm,
    currency,
    subTotal,
    formatter,
    currentMonthWorkingDaysCount,
    getValues,
    engagementMeasurementUnit,
    holidays,
    vacations,
    handleEmployeeChange,
    vacationsLoading,
    selectRef,
    blurRateInputRef,
    holidayCountry,
    errors,
    name,
    roleTitles,
    setRoleSeniorityPositionIds,
    columRules,
    employeeDeleteModal,
    setEmployeeDeleteModal,
    handleBasicSelectBlur,
    showRateTotal,
    showRateTotalChangeHandler,
    billingType,
    selectedEmployees,
    employeeList,
    setValue,
    register,
  } = useStaffingAndTerms(
    props.employees,
    props.setAlreadySelectedEmployees,
    props.engagementHasDifferentMeasurement,
    props.displayEmployeeVacationsOnChange,
    props.addChangesIsOpen,
    props.addChangesShowMode,
    props.isInInvoice,
    props.billingType,
    props.isInShowMode,
  );

  return (
    <>
      {employeeDeleteModal.isOpen && (
        <StaffingErrorModal
          employeeDeleteModal={employeeDeleteModal}
          setEmployeeDeleteModal={setEmployeeDeleteModal}
          removeTerm={removeTerm}
        />
      )}

      <div className='w-full max-w-306'>
        {!props.displayEmployeeVacationsOnChange && (
          <StaffingVacationInfo
            employees={props.employees}
            loading={props.loading}
            vacations={vacations}
            holidayCountry={holidayCountry}
            holidays={holidays}
            viewMode={props.viewMode}
            type={props.type}
          />
        )}

        {props.isInInvoice && (
          <section>
            <span className='text-slate-900 font-medium'>Employee, Role</span>
            <div className='flex items-center space-x-6'>
              <label htmlFor='name'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    {...register('employee_info_to_show_in_invoice', {
                      required: {
                        message: 'Employee, Role is required',
                        value: true,
                      },
                    })}
                    onClick={() => props.handleActiveCheckboxClick?.('employee')}
                    value='employee'
                    disabled={props.isInShowMode}
                    id='employee'
                  />
                  <span className='text-slate-900'>Employee</span>
                </div>
              </label>
              <label htmlFor='role'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    {...register('employee_info_to_show_in_invoice', {
                      required: {
                        message: 'Employee, Role is required',
                        value: true,
                      },
                    })}
                    onClick={() => props.handleActiveCheckboxClick?.('role')}
                    value='role'
                    disabled={props.isInShowMode}
                    id='role'
                  />
                  <span className='text-slate-900'>Role</span>
                </div>
              </label>
            </div>
            <div className='min-h-6 text-sm text-red-600'>
              <ErrorMessage name='employee_info_to_show_in_invoice' />
            </div>
          </section>
        )}

        <Table.Root
          renderColRules={columRules}
          headerCellClassName='text-left border-r last:border-r-0 border-zinc-200 bg-indigo-50 pl-7 py-3 text-sm font-medium text-indigo-900'
          rowCellClassName={twMerge(
            'p-1 flex text-left items-center px-6 border-r last:border-r-0 border-gray-100 py-6.5 font-medium leading-[1.625rem] text-zinc-700 focus-within:outline-solid focus-within:outline-1 focus-within:outline-violet-600 -outline-offset-1',
            (props.loading || !fields.length) && 'px-0',
          )}
          renderLoading={
            props.loading ? <div className='w-full h-5 mx-6 animate-pulse bg-gray-100' /> : null
          }
          renderEmpty={!fields.length && props.isInShowMode ? <div className='mx-6'>-</div> : null}
        >
          <Table.Header
            renderFilter={billingType !== 'default'}
            className='border border-zinc-200 rounded-tr-md rounded-tl-md'
            showRateTotal={showRateTotal}
            showRateTotalChangeHandler={showRateTotalChangeHandler}
          >
            <Table.Col render={(col) => col?.name} className='text-center px-0' />
            <Table.Col render={(col) => col?.name} />
            <Table.Col render={(col) => col?.name} />
            <Table.Col render={(col) => col?.name} />
            <Table.Col
              render={(col) =>
                props.engagementHasDifferentMeasurement ? (
                  <EngagementWithSelect isInShowMode={props.isInShowMode} />
                ) : props.billingType !== 'default' ? (
                  'Monthly engagement'
                ) : (
                  col?.name
                )
              }
            />
            <Table.Col
              render={() => (
                <>
                  {props.totalColumHeaderText ? props.totalColumHeaderText : 'Total '}
                  {props.showWorkingDaysNearTotal &&
                    currentMonthWorkingDaysCount &&
                    `(${currentMonthWorkingDaysCount} days)`}
                </>
              )}
            />
            <Table.Col render={(col) => col?.name} />
            <Table.Col render={(col) => col?.name} />
            <Table.Col render={() => null} />
          </Table.Header>

          {fields.map((staff, i) => (
            <Table.Row
              key={staff.id}
              className='border-x border-b border-gray-100 last:rounded-br-md last:rounded-bl-md '
            >
              <Table.Col render={() => i + 1} className='flex justify-center' />
              <Table.Col
                className={`px-1 py-0 border ${
                  getErrorMessage(errors, `${name}.${i}.employee_id`)
                    ? 'border-red-300!  outline-0'
                    : 'border-none'
                }`}
                render={() => (
                  <div
                    ref={selectRef}
                    id={i === fields.length - 1 ? 'last-select' : ''}
                    className='w-full'
                  >
                    <input type='hidden' ref={blurRateInputRef} />

                    <AdvancedSelect
                      inputName={`${name}.${i}.employee_id`}
                      list={employeeList}
                      initialList={employeeList}
                      placeholder='Select employee'
                      inputClassName={`border-none! outline-hidden! focus:border-transparent focus:ring-0 text-sm!`}
                      errorIconStyles='top-3!'
                      errorMessageDialogClass='-left-4!'
                      externalButtonClassName={`${
                        !getValues(`${name}.${i}.employee_id`) ? 'absolute top-2!' : '-top-3!'
                      }`}
                      externalOptionTextRenderer={EmployeesListOptionRenderer as () => JSX.Element}
                      externalButtonTextRenderer={(value) => {
                        const employeeId = getValues(`${name}.${i}.employee_id`);
                        const isEmployeeInActive = props.employees.some(
                          (item) => item.id !== employeeId,
                        );
                        return isEmployeeInActive
                          ? EmployeeButtonTextRendered(
                              value as number | string,
                              props.employeesWithArchived ?? props.employees,
                              getValues(`${name}.${i}`),
                              props.termData?.type === 'default',
                            )
                          : EmployeeButtonTextRendered(
                              value as number | string,
                              props.employeesWithArchived ?? props.employees,
                            );
                      }}
                      onChangeHandler={handleEmployeeChange}
                      canNotEdit={props.isInShowMode}
                      registerOptions={{
                        required: {
                          message: 'required',
                          value: true,
                        },
                      }}
                      showErrorMessageDialog
                      isTableCell
                      disableArrowIcon
                      removeErrorMessage
                      doNotRenderList={selectedEmployees}
                    />
                  </div>
                )}
              />
              <Table.Col
                className={`px-1 py-0 border ${
                  getErrorMessage(errors, `${name}.${i}.role`)
                    ? 'border-red-500!  outline-0'
                    : 'border-r border-b-0 border-t-0'
                }`}
                render={() => (
                  <AdvancedSelect
                    inputName={`${name}.${i}.role`}
                    list={roleTitles()}
                    onChangeHandler={(e) => setRoleSeniorityPositionIds({ id: e?.id }, i)}
                    placeholder={'Select role'}
                    registerOptions={{
                      required: {
                        message: 'Role is required',
                        value: true,
                      },
                    }}
                    externalButtonTextRenderer={(value) => {
                      const role = getValues(`${name}.${i}.role`);
                      if (!value) {
                        return <span className='px-4 text-sm text-zinc-400'>Select role</span>;
                      } else if (typeof value === 'string') {
                        return <span className='px-4'>{role}</span>;
                      } else {
                        const roleTitle = roleTitles()?.find((role) => +role.id === +value)?.title;
                        return <span className='px-4'>{roleTitle}</span>;
                      }
                    }}
                    externalButtonClassName='top-2!'
                    canNotEdit={props.isInShowMode}
                    inputClassName={`border-none! outline-hidden! focus:border-transparent focus:ring-0 bg-white text-sm disabled:bg-white disabled:text-zinc-700 `}
                    isTableCell
                    disableErrorIcon
                    disableArrowIcon
                  />
                )}
              />
              <Table.Col
                className='pl-6'
                render={() => (
                  <label
                    htmlFor={`${name}.${i}.rate`}
                    className='flex flex-row-reverse items-center'
                  >
                    <RateInput inputName={`${name}.${i}.rate`} isInShowMode={props.isInShowMode} />
                  </label>
                )}
              />
              <Table.Col
                className='pl-6'
                render={() => (
                  <label
                    htmlFor={`${name}.${i}.engagement`}
                    className={twMerge(
                      `${errors?.[name]?.[i]?.engagement && 'ring-red-500! border-0!'}`,
                    )}
                  >
                    {props.isInShowMode ? (
                      <div>
                        {getValues(`${name}.${i}.engagement`)}{' '}
                        {props.engagementHasDifferentMeasurement ? engagementMeasurementUnit : '%'}
                      </div>
                    ) : (
                      <InputWithFollowingSignAtEnd
                        inputName={`${name}.${i}.engagement`}
                        sign={
                          props.engagementHasDifferentMeasurement ? engagementMeasurementUnit : '%'
                        }
                        registerOptions={{ required: true }}
                        blurEvent={(e) => {
                          if (props.engagementHasDifferentMeasurement) return;
                          handleBasicSelectBlur(e);
                        }}
                        isInShowMode={props.isInShowMode}
                        signClasses={`${props.isInShowMode ? 'translate-x-3' : ''}`}
                        max={props.engagementHasDifferentMeasurement ? undefined : 100}
                        doNotCutSize={props.engagementHasDifferentMeasurement}
                      />
                    )}
                  </label>
                )}
              />
              <Table.Col
                className='pl-6'
                render={() => (
                  <EmployeeTotal
                    inputNameStart={`${name}.${i}`}
                    projectData={props.projectData}
                    isInShowMode={props.isInShowMode}
                    i={i}
                    showProject={false}
                    endDateIsGiven
                    termData={props.termData}
                    termHistoryIsOpen={props.termHistoryIsOpen}
                    addChangesShowMode={props.addChangesShowMode}
                    addChangesIsOpen={props.addChangesIsOpen}
                    engagementHasDifferentMeasurement={props.engagementHasDifferentMeasurement}
                    doNotCountWithoutEndDate
                    recalculateInEdit={props.recalculateInEdit}
                  />
                )}
              />

              <Table.Col
                className='justify-center flex  py-0! px-0!'
                render={() => (
                  <div>
                    <AdvancedSelect
                      inputName={`${name}.${i}.vat_id`}
                      list={[
                        { id: '', title: 'N/A' },
                        ...(props.vats as { id: number; title: string }[]),
                      ]}
                      placeholder='N/A'
                      inputClassName='bg-transparent! transition-none! disabled:text-black  border-none! text-sm! focus:ring-0! focus:outline-hidden! w-full h-full hover:bg-transparent! transition-none!'
                      dropDownStyles='top-12! shadow-md'
                      doNotLeavePlaceForError
                      isTableCell
                      canNotEdit={props.isInShowMode}
                      onChangeHandler={(e) => {
                        setValue(
                          `${name}.${i}.vat_amount`,
                          (e as unknown as { amount: number }).amount,
                        );
                      }}
                      noSearch
                    />
                  </div>
                )}
              />

              <Table.Col
                className='justify-center'
                render={() => (
                  <FreeOfChargeToggle
                    inputName={`${name}.${i}.is_free_of_charge`}
                    showProject={props.isInShowMode}
                    pageUniquePart={props.pageUniqueLabelPart}
                  />
                )}
              />
              <Table.Col
                className='pl-6'
                render={() =>
                  !props.isInShowMode && staff.id ? (
                    <button
                      onClick={() => {
                        if (!props.isInInvoice && props.termHistoryIsOpen) {
                          return setEmployeeDeleteModal({
                            isOpen: true,
                            index: i,
                            employee_id: staff.employee_id as number,
                            first_name: staff.name as string,
                          });
                        }

                        removeTerm(i, staff.employee_id);
                      }}
                      type='button'
                      className='rounded-[0.875rem] border border-zinc-200 bg-white py-1 px-2.5 text-sm  text-zinc-700 hover:bg-red-700 hover:text-white'
                    >
                      Delete
                    </button>
                  ) : null
                }
              />
            </Table.Row>
          ))}

          {(props.isInShowMode &&
            (props.removeRowWithTotalInfoBelow || props.termData?.type !== 'default')) ||
          props.cannotAddField ? null : (
            <Table.Row className='grid-cols-1! border-x border-b border-gray-100 rounded-bl-md rounded-br-md'>
              <Table.Col
                className='py-3 pl-6 outline-hidden!'
                render={() =>
                  props.isInShowMode ? (
                    <div className='flex items-center justify-end truncate border-t-0 border-l-0 text-sm leading-[1.625rem] text-zinc-400'>
                      {getCurrencySymbol(currency as Currency)}
                      {props.termHistoryIsOpen && props.termData
                        ? formatter
                            ?.format(subTotal((props.termData.staffs as Staff[]) || []) ?? 0)
                            ?.replaceAll(CURRENCY_SYMBOL_REGEX, '')
                            .trim()
                        : formatter
                            ?.format(subTotal(props.projectData?.staffs || []) ?? 0)
                            .replaceAll(CURRENCY_SYMBOL_REGEX, '')
                            .trim()}
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={addNewTerm}
                      className='flex items-center space-x-2 whitespace-nowrap text-zinc-400'
                    >
                      <Plus color='#999DA5' />
                      <span>Add a row</span>
                    </button>
                  )
                }
              />
            </Table.Row>
          )}
        </Table.Root>

        {props.displayEmployeeVacationsOnChange &&
          !!vacations?.length &&
          props?.billingType === 'default' && (
            <div className='mt-6 space-y-2'>
              {vacations.map((vacation) => {
                return (
                  <StaffVacation
                    loading={vacationsLoading || props.vacationsLoading}
                    vacation={vacation}
                    employees={props.employees}
                    key={vacation.vacation_id}
                  />
                );
              })}
            </div>
          )}
      </div>
    </>
  );
};

export default StaffingAndTerms;
