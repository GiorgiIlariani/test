import {
  NormalInput,
  StaffingAndTerms,
  DiscountSection,
  InvoiceOtherExpenses,
  Plus,
  ModalWrapper,
  InvoiceTermSection,
  FreeOfChargeToggle,
  SubmitButton,
  Totals,
  InvoiceNotice,
  InvoiceStatus,
  BasicSelect,
  MultiSelectDropdown,
} from 'components';
import {
  allowOnlyNumbersInInputWithDot,
  formatCurrency,
  formatDate,
  validateThatDateIsSane,
} from 'helpers';
import { Props } from './types';
import { useInvoiceModal } from './useInvoiceModal';
import { getButtonText } from './helpers';
import { InvoiceTypes, PaidStatus } from 'types';
import { InvoiceTermModalSkeletonLoader } from '../InvoiceTermModalSkeletonLoader/InvoiceView';
import { Trash2Icon } from 'lucide-react';

const InvoiceModal: React.FC<Props> = (props) => {
  const {
    startAndEndDateChangeHandler,
    otherExpensesChangeHandler,
    setHaveOtherExpenses,
    getContractAssetName,
    setIsDiscountToggled,
    gettingCalculations,
    setIsTableDelete,
    haveOtherExpenses,
    isDiscountToggled,
    submitHandler,
    isInShowMode,
    closeHandler,
    isTableOpen,
    submitting,
    isLoading,
    errors,
    form,
    user,
    sent,
    handleActiveCheckboxClick,
    transformPercentageToMaxMinValue,
    vats,
    previousScopeStartAndEndDateChangeHandler,
    bankAcounts,
    customFields,
    appendCustomField,
    removeCustomField,
  } = useInvoiceModal(
    props.reviewingInvoiceData,
    props.setContractAssetIsOpen,
    props.refreshInvoiceDashboard,
    props.updateInvoicesList,
    props.type,
    props.isOpen,
    props.id,
    props.setLoading,
    props.setErrorStatus,
    props.setInvoiceType,
    props.isInEdit,
    props.closeHandler,
    props.externalForm,
    props.setIsInEdit,
    props.loading,
    props.setReviewModalIsOpen,
    props.setInvoiceCreated,
    props.setInvoiceUpdated,
  );

  return (
    <ModalWrapper
      form={form}
      handleClose={closeHandler}
      handleSubmit={submitHandler}
      isOpen={props.isOpen}
      submitText={getButtonText(user.role, props.type, sent)}
      hideFooter={!!props.externalForm && !props.customFooter}
      isLoading={isLoading}
      customFooter={props.customFooter}
      title={
        <div className='flex gap-5'>
          {isLoading ? (
            <div className='h-5 w-48 bg-zinc-200 animate-pulse transition-all rounded-md' />
          ) : (
            <p>{getContractAssetName(!props.id)}</p>
          )}
          {props.id && (
            <InvoiceStatus
              partiallyPaidAmount={form.getValues('partially_paid_amount') as number}
              form={form}
              formatter={formatCurrency()}
              type={form.getValues('type') as InvoiceTypes}
              paidStatus={form.getValues('payment_status') as PaidStatus}
            />
          )}
        </div>
      }
      submitButton={
        <SubmitButton
          sent={isInShowMode}
          submitting={submitting}
          type={props.type}
          role={user.role}
        />
      }
    >
      {!isLoading ? (
        <section className='p-6 flex flex-col'>
          <div className='flex z-100'>
            <div className='relative flex w-150 items-start space-x-6'>
              {!isInShowMode ? (
                <NormalInput
                  inputName='start_date'
                  labelName='Start date *'
                  placeholder='Enter start date'
                  type='date'
                  registerOptions={{
                    required: {
                      message: 'Project start date is required',
                      value: true,
                    },
                    validate: validateThatDateIsSane,
                  }}
                  OnDateChange={startAndEndDateChangeHandler.bind(null, 'start_date')}
                />
              ) : (
                <div className='w-full self-start'>
                  <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>
                    Start date
                  </span>
                  <div className='text-zinc-700 h-10'>
                    {formatDate(form.getValues('start_date'))}
                  </div>
                </div>
              )}
              {!isInShowMode ? (
                <NormalInput
                  inputName='end_date'
                  labelName='End date *'
                  placeholder='Enter end date'
                  type='date'
                  registerOptions={{
                    required: {
                      message: 'Project end date is required',
                      value: true,
                    },
                    validate: validateThatDateIsSane,
                  }}
                  labelClasses='text-slate-900'
                  OnDateChange={startAndEndDateChangeHandler.bind(null, 'end_date')}
                />
              ) : (
                <div className='w-full self-start'>
                  <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>End date</span>
                  <div className='text-zinc-700 h-10'>{formatDate(form.getValues('end_date'))}</div>
                </div>
              )}
            </div>
            <div className='ml-auto'>{props.subHeader}</div>
          </div>

          <div className='relative flex w-150 items-start space-x-6'>
            {props.type !== 'contract asset' &&
              (!isInShowMode ? (
                <div className='flex-1'>
                  <NormalInput
                    inputName='invoice_date'
                    labelName='Invoice date *'
                    placeholder='Enter invoice date'
                    type='date'
                    registerOptions={{
                      required: {
                        message: 'Invoice date is required',
                        value: true,
                      },
                      validate: validateThatDateIsSane,
                    }}
                  />
                </div>
              ) : (
                <div className='w-full self-start'>
                  <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>
                    Invoice date
                  </span>
                  <div className='text-zinc-700 h-10'>
                    {formatDate(form.getValues('invoice_date') as string)}
                  </div>
                </div>
              ))}
            {!isInShowMode ? (
              <div>
                <BasicSelect
                  inputName='currency'
                  labelName='Invoice currency*'
                  list={['USD', 'EUR', 'GBP', 'GEL']}
                  placeholder='Choose invoice currency'
                  inputClassName='py-2! w-72!'
                  noSearch
                  disableArrowIcon
                  registerOptions={{
                    required: {
                      message: 'Currency is required',
                      value: true,
                    },
                  }}
                />
              </div>
            ) : (
              <div className='w-full self-start'>
                <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>
                  Invoice currency
                </span>
                <div className='text-zinc-700 h-10'>{form.getValues('currency')}</div>
              </div>
            )}
          </div>

          <div className='relative flex w-150 items-start space-x-6 mb-3'>
            <div>
              <MultiSelectDropdown
                label='Bank accounts'
                list={bankAcounts}
                inputName='bank_accounts'
                placeholder='Choose bank accounts'
                disabled={isInShowMode}
                className='w-[18rem]'
              />
            </div>
          </div>

          {(!isInShowMode || customFields.length > 0) && (
            <section className='my-5 w-150'>
              <div className='flex items-center justify-between gap-2'>
                <div>
                  <h3 className='text-base font-bold text-slate-900'>Additional fields</h3>

                  {!isInShowMode && (
                    <p className='text-sm text-gray-500'>
                      Up to 10 fields. Each label and value can contain up to 100 characters.
                    </p>
                  )}
                </div>

                {!isInShowMode && (
                  <button
                    type='button'
                    onClick={() =>
                      appendCustomField({
                        label: { en: '', ka: '' },
                        value: '',
                      })
                    }
                    disabled={customFields.length >= 10}
                    className='h-10 w-fit flex items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-slate-900 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <Plus color='#323841' />
                    <span>Add field</span>
                  </button>
                )}
              </div>

              {customFields.length > 0 && (
                <div className='flex flex-col gap-2 mt-4'>
                  {customFields.map((field, index) => (
                    <div key={field.id} className='flex items-end gap-2'>
                      <NormalInput
                        inputName={`custom_fields.${index}.label.en`}
                        labelName='Label (English)'
                        placeholder='e.g. PO Number'
                        containerClasses='flex-1'
                        canNotEdit={isInShowMode}
                        registerOptions={{
                          required: 'English label is required.',
                          maxLength: {
                            value: 100,
                            message: 'Should not exceed 100 characters.',
                          },
                        }}
                        autoComplete='off'
                      />

                      <NormalInput
                        inputName={`custom_fields.${index}.label.ka`}
                        labelName='Label (Georgian)'
                        placeholder='მაგ. შესყიდვის ნომერი'
                        containerClasses='flex-1'
                        canNotEdit={isInShowMode}
                        registerOptions={{
                          required: 'Georgian label is required.',
                          maxLength: {
                            value: 100,
                            message: 'Should not exceed 100 characters.',
                          },
                        }}
                        autoComplete='off'
                      />

                      <NormalInput
                        inputName={`custom_fields.${index}.value`}
                        labelName='Value'
                        placeholder='Enter value'
                        containerClasses='flex-1'
                        canNotEdit={isInShowMode}
                        registerOptions={{
                          required: 'Value is required',
                          maxLength: {
                            value: 100,
                            message: 'Should not exceed 100 characters.',
                          },
                        }}
                        autoComplete='off'
                      />

                      {!isInShowMode && (
                        <button
                          type='button'
                          onClick={() => removeCustomField(index)}
                          className='mb-6 flex size-10 items-center justify-center rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                        >
                          <Trash2Icon className='size-4' />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {props.type === 'revenue' && (
            <div className='flex'>
              <div className='flex items-center gap-2'>
                <FreeOfChargeToggle
                  inputName={'is_revenue_invoice'}
                  showProject={isInShowMode}
                  defaultValue={form.getValues('is_revenue_invoice')}
                />
                <p className='text-sm text-zinc-700 font-medium'>Count revenue as invoice</p>
              </div>
            </div>
          )}

          {isTableOpen('fixed') && (
            <section className='my-5'>
              <div className='flex mb-4'>
                <span className='font-bold block text-slate-900 text-base align-top'>
                  Fixed price
                </span>
                {!isInShowMode && (
                  <button
                    className='text-sm font-medium px-3 py-2 text-[#DC2626] border border-[#DC2626] rounded-md ml-auto hover:bg-[#DC2626] hover:text-white'
                    onClick={() => {
                      form.setValue('fixed', []);
                      setIsTableDelete((prev) => ({ ...prev, isFixedDelete: true, fixed: true }));
                    }}
                    type='button'
                  >
                    Remove Table
                  </button>
                )}
              </div>
              <InvoiceTermSection
                isInShowMode={isInShowMode}
                hasCompletion
                fieldName='fixed'
                vats={vats}
              />
            </section>
          )}
          {isTableOpen('monthly') && (
            <section className='my-5'>
              <div className='flex mb-4'>
                <span className='font-bold block text-slate-900 text-base align-top'>
                  Monthly retainer
                </span>
                {!isInShowMode && (
                  <button
                    className='text-sm font-medium px-3 py-2 text-[#DC2626] border border-[#DC2626] rounded-md ml-auto hover:bg-[#DC2626] hover:text-white'
                    onClick={() => {
                      form.setValue('monthly', []);
                      setIsTableDelete((prev) => ({
                        ...prev,
                        isMonthlyDelete: true,
                        monthly: true,
                      }));
                    }}
                    type='button'
                  >
                    Remove Table
                  </button>
                )}
              </div>
              <InvoiceTermSection
                isInShowMode={isInShowMode}
                hasCompletion={false}
                fieldName='monthly'
                vats={vats}
              />
            </section>
          )}

          {isTableOpen('staffs') && (
            <section className='my-5'>
              <div className='flex mb-4'>
                <span className='font-bold block text-slate-900 text-base align-top'>T & M</span>
                {!isInShowMode && (
                  <button
                    className='text-sm font-medium px-3 py-2 text-[#DC2626] border border-[#DC2626] rounded-md ml-auto hover:bg-[#DC2626] hover:text-white'
                    onClick={() => {
                      form.setValue('staffs', []);
                      setIsTableDelete((prev) => ({
                        ...prev,
                        isDefaultDelete: true,
                        staffs: true,
                      }));
                    }}
                    type='button'
                  >
                    Remove Table
                  </button>
                )}
              </div>
              {props.type === 'proforma' && (
                <div className='flex z-100'>
                  <div className='relative flex w-150 items-start space-x-6'>
                    {!isInShowMode ? (
                      <NormalInput
                        inputName='previous_scope_start_date'
                        labelName='Vacation scope start date'
                        placeholder='Enter start date'
                        type='date'
                        registerOptions={{
                          validate: validateThatDateIsSane,
                        }}
                        OnDateChange={previousScopeStartAndEndDateChangeHandler}
                      />
                    ) : (
                      <div className='w-full self-start'>
                        <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>
                          Vacation scope start date
                        </span>
                        <div className='text-zinc-700 h-10'>
                          {form.getValues('previous_scope_start_date')
                            ? formatDate(form.getValues('previous_scope_start_date')!)
                            : 'N/A'}
                        </div>
                      </div>
                    )}
                    {!isInShowMode ? (
                      <NormalInput
                        inputName='previous_scope_end_date'
                        labelName='Vacation scope end date'
                        placeholder='Enter end date'
                        type='date'
                        registerOptions={{
                          validate: validateThatDateIsSane,
                        }}
                        labelClasses='text-slate-900'
                        OnDateChange={previousScopeStartAndEndDateChangeHandler}
                      />
                    ) : (
                      <div className='w-full self-start'>
                        <span className={`mb-3 block text-sm font-medium text-zinc-400 `}>
                          Vacation scope end date
                        </span>
                        <div className='text-zinc-700 h-10'>
                          {form.getValues('previous_scope_end_date')
                            ? formatDate(form.getValues('previous_scope_end_date')!)
                            : 'N/A'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <StaffingAndTerms
                employees={props.employees}
                employeesWithArchived={props.employeesWithArchived}
                engagementHasDifferentMeasurement
                isInShowMode={isInShowMode}
                pageUniqueLabelPart='create-invoice'
                removeRowWithTotalInfoBelow
                loading={gettingCalculations}
                billingType='default'
                recalculateInEdit
                cannotAddField
                isInInvoice
                vats={vats}
                type={props.type}
                handleActiveCheckboxClick={handleActiveCheckboxClick}
              />
            </section>
          )}

          <section className='my-5'>
            {!haveOtherExpenses && !form.getValues('expenses')?.length ? (
              !isInShowMode && (
                <button
                  onClick={otherExpensesChangeHandler}
                  className='border border-gray-300 px-8 w-56 h-10 rounded-md flex items-center text-slate-900 text-sm font-medium hover:bg-gray-200'
                >
                  <Plus color='#323841' />
                  <span className='inline-block ml-2'>Add other expenses</span>
                </button>
              )
            ) : (
              <h3 className='text-base font-bold'>Other expenses</h3>
            )}
            {!(haveOtherExpenses || errors.expenses || form.getValues('expenses')?.length) || (
              <div className='mt-6'>
                <InvoiceOtherExpenses
                  isInShowMode={isInShowMode}
                  haveOtherExpenses={haveOtherExpenses}
                  setHaveOtherExpenses={setHaveOtherExpenses}
                  vats={vats}
                />
              </div>
            )}
          </section>
          {(!!form.getValues('staffs')?.length ||
            !!form.getValues('fixed')?.length ||
            !!form.getValues('monthly')?.length) && (
            <>
              <section className='my-5'>
                <div className='flex gap-4'>
                  <h3 className='text-base font-bold'>Discount</h3>
                  <FreeOfChargeToggle
                    inputName='discount_toggle'
                    showProject={isInShowMode}
                    defaultValue={!!Math.ceil(form.getValues('discount') as number)}
                    onChangeHandler={(e) => {
                      if (e.target.checked) {
                        setIsDiscountToggled(true);
                      } else {
                        setIsDiscountToggled(false);
                        form.setValue('discount', 0);
                        form.setValue('discount_duration', 0);
                      }
                      form.setValue('discount_percentage', 0);
                    }}
                  />
                </div>
              </section>
            </>
          )}
          {(isDiscountToggled || !!Math.ceil(form.getValues('discount') as number)) && (
            <div className='mt-3'>
              <DiscountSection
                isInShowMode={isInShowMode}
                extraWrapperClasses='mb-10'
                removeDuration
              />
            </div>
          )}

          <section className='relative mb-5 w-80'>
            <NormalInput
              inputName='surcharge_percentage'
              type='text'
              labelName='Surcharge'
              placeholder='Enter Surcharge Percentage'
              canNotEdit={isInShowMode}
              externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
              blurHandler={(e: any) => transformPercentageToMaxMinValue(e)}
            />
          </section>

          <Totals form={form} hideFreeOfCharge={!isTableOpen('staffs')} hideVAT={props.hideVAT} />
          <InvoiceNotice sent={isInShowMode} form={form} />
          {props.children}
        </section>
      ) : (
        <InvoiceTermModalSkeletonLoader />
      )}
    </ModalWrapper>
  );
};

export default InvoiceModal;
