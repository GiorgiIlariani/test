import { BudgetTotalsTerm } from 'types';
import {
  allowOnlyNumbersInInputWithDot,
  analytics,
  convertNumbersAsPrice,
  getCurrencySymbol,
  truncateString,
} from 'helpers';
import {
  AdvancedSelect,
  ErrorModal,
  InputWithRef,
  PortalWrapper,
  BlueExclamationCircle,
  CostIcon,
  ProfitIcon,
  X,
} from 'components';
import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useTermTotals } from './useTermTotals';
import EditPencil from 'components/icons/EditPencil';

const TermTotals = (props: Props) => {
  const {
    updateRates,
    filteredItems,
    findTotalsObject,
    findCalculationTitle,
    findCalculationItem,
    setSubtotalModalIsOpen,
    setValue,
    getValues,
    budgetTotals,
    subtotalModalIsOpen,
    getCurrentTerms,
    isLoading,
    selectedTermExists,
    isPossibleToCalculate,
    calculateMissingText,
    setBudgetTotals,
    closeHandler,
    setOldSubtotal,
    totalTermRef,
    totalTermRefSecond,
    calculateMonthlyMissingText,
    monthlyMissingText,
    selectedTermTypeIsMonthly,
    monthlyRef,
    subtotalModalIsOpenByMonthly,
    setSubtotalModalIsOpenByMonthly,
    fee,
    setFee,
    formState,
    setOldMonthly,
    editPhaseId,
  } = useTermTotals(
    props.budgetIsUpdated,
    props.selectedTermId,
    props.budgetId,
    props.totalNav,
    props.getBudgetingPhasesHandler,
    props.rateCardUpdated,
    props.countHolidaysUpdated,
    props.projectTypeUpdated,
    props.publishedBudgetIsInEditMode,
    props.setSelectedTermId,
    props.setBudgetTotal,
    props.budgetPhaseListingItemEdited,
    props.shouldResetTotals,
    props.setShouldResetTotals,
  );

  return (
    <>
      {(subtotalModalIsOpen || subtotalModalIsOpenByMonthly) && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Modify & adjust rates'
            modalMessage={
              subtotalModalIsOpenByMonthly
                ? 'Adjusting monthly fee will automatically update associated rates.'
                : 'Adjusting subtotal will automatically update associated rates.'
            }
            modalTitle={
              subtotalModalIsOpenByMonthly
                ? 'Are you sure you want to modify phase \n monthly fee?'
                : 'Are you sure you want to modify budget subtotal?'
            }
            confirmButtonColor='bg-indigo-500'
            confirmButtonFocusColor='focus:ring-indigo-800'
            confirmButtonHoverColor='hover:bg-indigo-700'
            icon={<BlueExclamationCircle className='h-10 w-10' />}
            iconBackgroundColor='bg-white'
            closeHandler={closeHandler}
            confirmFunction={() => {
              updateRates(
                !subtotalModalIsOpenByMonthly
                  ? selectedTermExists
                    ? getValues(`phase_subtotal.${props.selectedTermId}`)
                    : getValues('subtotal')
                  : fee,
                props.selectedTermId,
                subtotalModalIsOpenByMonthly,
              );
              setSubtotalModalIsOpen(false);
              setSubtotalModalIsOpenByMonthly(false);
            }}
            isLoading={props.isSaving}
          />
        </PortalWrapper>
      )}
      <section className='w-[94%] mx-8 xl:mx-0 xl:ml-0 xl:w-[32%] '>
        <div className='w-full border border-zinc-200 p-9 rounded-md mt-4 text-zinc-700 bg-white'>
          {isLoading ? (
            <div className='animate-pulse'>
              <div className='h-5 bg-gray-200 rounded-md w-24 mb-4'></div>
              <div className='flex gap-2 items-center text-xs mb-4'>
                <div className='h-6 w-16 bg-gray-200 rounded-xl'></div>
                <div className='h-6 w-16 bg-gray-200 rounded-xl'></div>
                <div className='h-6 w-16 bg-gray-200 rounded-xl'></div>
              </div>
              <div className='flex justify-between items-center mb-4'>
                <div className='h-5 bg-gray-200 rounded-md w-20'></div>
                <div className='flex items-center gap-1'>
                  <div className='h-5 bg-gray-200 rounded-md w-24'></div>
                </div>
              </div>
              <div className='flex justify-between items-center mb-4'>
                <div className='h-5 bg-gray-200 rounded-md w-24'></div>
                <div className='h-5 bg-gray-200 rounded-md w-20'></div>
              </div>
              <div className='flex justify-between items-center mb-4'>
                <div className='h-5 bg-gray-200 rounded-md w-20'></div>
                <div className='h-5 bg-gray-200 rounded-md w-16'></div>
              </div>
              <hr className='my-3 bg-zinc-200' />
              <div className='flex justify-between items-center font-bold ml-0.5'>
                <div className='h-5 bg-gray-200 rounded-md w-16'></div>
                <div className='h-5 bg-gray-200 rounded-md w-20'></div>
              </div>
              <div className='mt-6 flex justify-between'>
                <div className='flex gap-0 w-36'>
                  <div className='bg-gray-200 h-8 w-2 rounded-l-md'></div>
                  <div className=' bg-gray-200 flex gap-4 p-3 py-2 w-full rounded-r-md'></div>
                </div>
                <div className='flex gap-0 w-36'>
                  <div className='bg-gray-200 h-8 w-2 rounded-l-md'></div>
                  <div className=' bg-gray-200 flex gap-4 p-3 py-2 w-full rounded-r-md'></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className='flex gap-3 items-center'>
                <h2 className='font-bold text-xl mb-3'>Totals</h2>
                {!isPossibleToCalculate && (
                  <div>
                    {selectedTermExists ? (
                      <p className='bg-indigo-600 px-2.5 py-1 text-xs text-white rounded-2xl flex items-center gap-2 mb-3'>
                        <span>
                          {budgetTotals?.by_phase.find(
                            (term) => term.term_id === props.selectedTermId,
                          )?.term_name ?? 'Untitled'}
                        </span>
                        {!editPhaseId && (
                          <span
                            className='cursor-pointer'
                            onClick={() => {
                              setValue('selected_term', 'all');
                              props.setSelectedTermId(null);
                              props.setIsOpen(undefined);
                              props.setSubtotalEditIsActive(false);
                            }}
                          >
                            <X size={10} stroke='white' />
                          </span>
                        )}
                      </p>
                    ) : (
                      <AdvancedSelect
                        list={getCurrentTerms()}
                        inputName='selected_term'
                        inputClassName='text-xs py-1 px-2 h-7 focus:ring-zinc-700 hover:bg-gray-200'
                        className='w-28 -mb-1'
                        dropDownStyles='top-7'
                        onChangeHandler={(e) => {
                          props.setSelectedTermId(e.id === 'all' ? null : e.id);
                          props.setIsOpen(
                            e.id === 'all'
                              ? undefined
                              : getValues('phase')?.findIndex(
                                  (term: any) => (term.item_id ?? term.id) == e.id,
                                ) + 1,
                          );
                          props.setTotalNav('total');
                          props.setSubtotalEditIsActive(false);
                        }}
                        doNotLeavePlaceForError={true}
                      />
                    )}
                  </div>
                )}
              </div>

              <nav className='flex gap-2 items-center text-xs'>
                <p
                  className={twMerge(
                    'border border-gray-100 hover:bg-gray-100 rounded-xl px-2.5 py-1 cursor-pointer bg-white',
                    props.totalNav === 'total' &&
                      'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white',
                    isPossibleToCalculate &&
                      'border-gray-100 text-zinc-200 opacity-50 pointer-events-none bg-white',
                  )}
                  onClick={() => {
                    props.setTotalNav('total');
                    analytics.track('Budget totals - total');
                  }}
                >
                  Total
                </p>
                <p
                  className={twMerge(
                    'border border-gray-100 hover:bg-gray-100 rounded-xl px-2.5 py-1 cursor-pointer bg-white',
                    props.totalNav === 'month' &&
                      'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white',
                    isPossibleToCalculate &&
                      'border-gray-100 text-zinc-200 opacity-50 pointer-events-none bg-white',
                  )}
                  onClick={() => {
                    props.setTotalNav('month');
                    analytics.track('Budget totals - by month');
                  }}
                >
                  By month
                </p>

                {!selectedTermExists && (
                  <p
                    className={twMerge(
                      'border border-gray-100 hover:bg-gray-100 rounded-xl px-2.5 py-1 cursor-pointer bg-white',
                      props.totalNav === 'phase' &&
                        'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white',
                      isPossibleToCalculate &&
                        'border-gray-100 text-zinc-200 opacity-50 pointer-events-none bg-white',
                    )}
                    onClick={() => {
                      props.setTotalNav('phase');
                      analytics.track('Budget totals - by phase');
                    }}
                  >
                    By phase
                  </p>
                )}
              </nav>

              {!isPossibleToCalculate && props.totalNav === 'total' && (
                <section className='mt-8 text-sm'>
                  {!selectedTermTypeIsMonthly || (
                    <div className='flex justify-between items-center mb-2'>
                      <p>Monthly fee</p>

                      <div
                        className={`${
                          props.monthlyEditIsActive ? 'opacity-100' : 'opacity-0'
                        } flex items-center justify-center gap-1 w-[5.5rem] bg-gray-50 hover:bg-gray-200 border border-zinc-26 py-1 px-3 rounded-md`}
                      >
                        <span>{getCurrencySymbol(props.currency)}</span>

                        <InputWithRef
                          className='text-sm w-full border-none focus:outline-hidden focus:ring-0 focus:border-none bg-inherit m-0 p-0'
                          inputName={`phase_monthly.${props.selectedTermId}`}
                          blurHandler={(e) => {
                            formState.dirtyFields?.phase_monthly?.length &&
                              setSubtotalModalIsOpenByMonthly(true);
                            setOldMonthly(
                              budgetTotals?.by_phase?.find(
                                (el) => +el.term_id! == +props.selectedTermId!,
                              )?.fee,
                            );
                            setFee(Number(e?.target?.value) ?? 0);
                            props.setMonthlyEditIsActive(false);
                          }}
                          inputRef={monthlyRef}
                          externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
                        />
                      </div>

                      {!props.monthlyEditIsActive && (
                        <p className='flex items-center'>
                          {props.isReadOnly || (
                            <span
                              className='mr-2 cursor-pointer p-1 rounded-full bg-indigo-50 hover:opacity-70'
                              onClick={() => {
                                props.setMonthlyEditIsActive(true);
                                monthlyRef.current?.focus();
                              }}
                            >
                              <EditPencil />
                            </span>
                          )}
                          <span className='font-normal'>{getCurrencySymbol(props.currency)}</span>
                          {convertNumbersAsPrice(
                            getValues(`phase_monthly.${props.selectedTermId}`)
                              ? getValues(`phase_monthly.${props.selectedTermId}`)
                              : 0,
                          )}
                        </p>
                      )}
                    </div>
                  )}
                  <div className='flex justify-between items-center mb-2'>
                    <p>Subtotal</p>

                    <div
                      className={`${
                        props.subtotalEditIsActive ? 'opacity-100' : 'opacity-0'
                      } flex items-center justify-center gap-1 w-[5.5rem] bg-gray-50 hover:bg-gray-200 border border-zinc-26 py-1 px-3 rounded-md`}
                    >
                      <span>{getCurrencySymbol(props.currency)}</span>
                      {props.selectedTermId && selectedTermExists ? (
                        <InputWithRef
                          className='text-sm w-full border-none focus:outline-hidden focus:ring-0 focus:border-none bg-inherit m-0 p-0'
                          inputName={`phase_subtotal.${props.selectedTermId}`}
                          blurHandler={(e) => {
                            formState.dirtyFields?.phase_subtotal?.length &&
                              setSubtotalModalIsOpen(true);
                            setBudgetTotals((prev) => {
                              if (!prev) return prev;

                              const newBudget = { ...prev };
                              const updatedByPhase = newBudget.by_phase.map((phase) => {
                                if (props.selectedTermId === phase.term_id) {
                                  setOldSubtotal(phase.subtotal);
                                  return {
                                    ...phase,
                                    subtotal: Number(e?.target.value),
                                  };
                                }

                                return phase;
                              });

                              return {
                                ...newBudget,
                                by_phase: updatedByPhase,
                              };
                            });

                            props.setSubtotalEditIsActive(false);
                          }}
                          externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
                          inputRef={totalTermRef}
                        />
                      ) : (
                        <>
                          <InputWithRef
                            inputName={'subtotal'}
                            className='text-sm w-full border-none focus:outline-hidden focus:ring-0 focus:border-none bg-inherit m-0 p-0'
                            blurHandler={(e) => {
                              e?.target.value === getValues('subtotal') &&
                                (formState.dirtyFields?.subtotal ||
                                  formState.dirtyFields?.phase?.length) &&
                                setSubtotalModalIsOpen(true);
                              setBudgetTotals((prev) => {
                                if (!prev) return prev;
                                const newBudget = { ...prev };
                                setOldSubtotal(newBudget.subtotal);
                                newBudget.subtotal = Number(e?.target.value);
                                return newBudget;
                              });
                              props.setSubtotalEditIsActive(false);
                            }}
                            externalKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
                            inputRef={totalTermRefSecond}
                          />
                        </>
                      )}
                    </div>

                    {!props.subtotalEditIsActive && (
                      <p className='flex items-center'>
                        {props.isReadOnly || props.isProjectInternal || (
                          <span
                            className='mr-2 cursor-pointer p-1 rounded-full bg-indigo-50 hover:opacity-70'
                            onClick={() => {
                              props.setSubtotalEditIsActive(true);
                              props.selectedTermId && selectedTermExists
                                ? totalTermRef.current?.focus()
                                : totalTermRefSecond.current?.focus();
                            }}
                          >
                            <EditPencil />
                          </span>
                        )}
                        <span className='font-normal'>{getCurrencySymbol(props.currency)}</span>
                        {convertNumbersAsPrice(findTotalsObject()?.subtotal ?? 0)}
                      </p>
                    )}
                  </div>
                  <div className='flex justify-between items-center mb-2'>
                    <p>Free of charge</p>
                    <p className='flex items-center'>
                      {' '}
                      <span className='font-normal'>{getCurrencySymbol(props.currency)}</span>
                      {convertNumbersAsPrice(findTotalsObject()?.free_of_charge ?? 0)}
                    </p>
                  </div>

                  <div className='flex justify-between items-center mb-2'>
                    <p>Discount</p>
                    <p className='flex items-center'>
                      {' '}
                      <span>{getCurrencySymbol(props.currency)}</span>
                      {convertNumbersAsPrice(findTotalsObject()?.discount ?? 0)}
                    </p>
                  </div>
                  <hr className='my-3 bg-zinc-200' />
                  <div className='flex justify-between items-center font-bold ml-0.5'>
                    <p>Total</p>
                    <p className='flex items-center'>
                      {' '}
                      <span>{getCurrencySymbol(props.currency)}</span>
                      {convertNumbersAsPrice(findTotalsObject()?.total ?? 0)}
                    </p>
                  </div>
                  <div className='mt-6 text-xs flex justify-center gap-[4%]'>
                    <div className='flex items-center justify-start w-[48%] rounded-sm bg-gray-50 gap-1 pl-3 py-[0.313rem] rounded-r-md'>
                      <CostIcon />

                      <p>Cost</p>
                      <p className='flex items-center'>
                        <span>{getCurrencySymbol(props.currency)}</span>
                        {convertNumbersAsPrice(findTotalsObject()?.cost ?? 0)}
                      </p>
                    </div>

                    <div className='flex items-center justify-start w-[48%] rounded-sm bg-gray-50 gap-1 pl-3 py-[0.313rem] rounded-r-md'>
                      <ProfitIcon />

                      <p>Profit</p>
                      <p className='flex items-center'>
                        <span>{getCurrencySymbol(props.currency)}</span>
                        {convertNumbersAsPrice(findTotalsObject()?.profit ?? 0)}
                        <span className='pl-1'>
                          {' '}
                          {`(${
                            findTotalsObject()?.total && findTotalsObject()?.profit
                              ? Math.round(
                                  (findTotalsObject()?.profit! / findTotalsObject()?.total!) * 100,
                                )
                              : 0
                          }%)`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {findTotalsObject()?.missing !== 'no' && (
                    <div className='flex items-center gap-1 mt-8'>
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>
                        {calculateMissingText(findTotalsObject()?.missing ?? 'no')}
                      </p>
                    </div>
                  )}

                  {monthlyMissingText && monthlyMissingText !== 'not missing' && (
                    <div
                      className={twMerge(
                        'flex items-center gap-1 mt-2',
                        findTotalsObject()?.missing === 'no' && 'mt-8',
                      )}
                    >
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>
                        {calculateMonthlyMissingText(monthlyMissingText as string)}
                      </p>
                    </div>
                  )}

                  {!props.selectedTermId && budgetTotals?.has_expired && (
                    <div
                      className={twMerge(
                        'flex items-center gap-1 mt-2',
                        findTotalsObject()?.missing !== 'no' &&
                          monthlyMissingText &&
                          monthlyMissingText !== 'not missing' &&
                          'mt-8',
                      )}
                    >
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>Expired phases are not calculated in totals</p>
                    </div>
                  )}
                </section>
              )}

              {!isPossibleToCalculate && props.totalNav !== 'total' && (
                <section className='mt-8 text-sm flex flex-col gap-3 leading-6'>
                  <div className='grid grid-cols-12'>
                    <p
                      className={twMerge(
                        'col-span-2 font-bold',
                        props.totalNav === 'month' && 'col-span-3',
                      )}
                    ></p>
                    <p className='col-span-3 font-bold'>Revenue</p>
                    <p className='col-span-3 font-bold'>Cost</p>
                    <p
                      className={twMerge(
                        'col-span-4 font-bold',
                        props.totalNav === 'month' && 'col-span-3',
                      )}
                    >
                      Profit
                    </p>
                  </div>

                  <div className='max-h-40 overflow-y-auto'>
                    {filteredItems.map(
                      (item: string | number | BudgetTotalsTerm, index: number) => {
                        const calculation = findCalculationItem(item);
                        return (
                          <div className='grid grid-cols-12' key={index}>
                            <p
                              className={twMerge(
                                'col-span-2 font-bold',
                                props.totalNav === 'month' && 'col-span-3',
                              )}
                            >
                              {truncateString(
                                (findCalculationTitle(item) as string) ?? 'Untitled',
                                props.totalNav === 'month' ? 10 : 9,
                              )}
                            </p>
                            <p className='col-span-3 text-[#5A636F] pl-0.5 flex items-center'>
                              <span>{getCurrencySymbol(props.currency)}</span>
                              {convertNumbersAsPrice(calculation.total ?? 0)}
                            </p>
                            <p className='col-span-3 text-[#5A636F] flex items-center'>
                              <span>{getCurrencySymbol(props.currency)}</span>
                              {convertNumbersAsPrice(calculation.cost ?? 0)}
                            </p>
                            <p
                              className={twMerge(
                                'col-span-4 text-[#5A636F] flex items-center',
                                props.totalNav === 'month' && 'col-span-3',
                              )}
                            >
                              <span>{getCurrencySymbol(props.currency)}</span>
                              {convertNumbersAsPrice(calculation.profit ?? 0)}{' '}
                              <span className='pl-1'>
                                ({calculation.profit_margin?.toFixed(0)}%)
                              </span>
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {props.totalNav === 'month' && filteredItems.includes('Month 1') && (
                    <div className='flex items-center gap-1 mt-8'>
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>
                        Monthly financial data assumes no overlapping phases. For precise figures,
                        add start and end dates to all phases.
                      </p>
                    </div>
                  )}

                  {monthlyMissingText && monthlyMissingText !== 'not missing' && (
                    <div
                      className={twMerge(
                        'flex items-center gap-1 mt-2',
                        (props.totalNav === 'phase' || !filteredItems.includes('Month 1')) &&
                          'mt-8',
                      )}
                    >
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>
                        {calculateMonthlyMissingText(monthlyMissingText as string)}
                      </p>
                    </div>
                  )}

                  {!props.selectedTermId && budgetTotals?.has_expired && (
                    <div
                      className={twMerge(
                        'flex items-center gap-1 mt-2',
                        props.totalNav !== 'month' &&
                          !filteredItems.includes('Month 1') &&
                          !monthlyMissingText &&
                          monthlyMissingText === 'not missing' &&
                          'mt-8',
                      )}
                    >
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>Expired phases are not calculated in totals</p>
                    </div>
                  )}
                </section>
              )}

              {isPossibleToCalculate && (
                <section className='mt-8 text-xs leading-5 text-[#5A636F]'>
                  <p>To calculate totals you have to: </p>
                  <ol className='list-decimal ml-4'>
                    <li>Add roles</li>
                    <li>Add duration on each role</li>
                    <li>Add engagement on each role</li>
                    {!props.isProjectInternal && <li>Add hourly rates on each role</li>}
                  </ol>
                </section>
              )}
            </>
          )}
        </div>
        <p className='text-[#5A636F] text-xs mt-4 w-full justify-center gap-1 hidden'>
          <span className='text-zinc-400'>not sure about something?</span>{' '}
          <span className='hover:underline cursor-pointer font-medium'>Send for approval</span>
        </p>
      </section>
    </>
  );
};

export default TermTotals;
