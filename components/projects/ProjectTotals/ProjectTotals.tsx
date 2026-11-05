import { BudgetTotalsTerm } from 'types';
import { analytics, convertNumbersAsPrice, getCurrencySymbol, truncateString } from 'helpers';
import { AdvancedSelect, BlueExclamationCircle, CostIcon, ProfitIcon, X } from 'components';
import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useProjectTotals } from './useProjectTotals';
import { FormProvider } from 'react-hook-form';

const ProjectTotals = (props: Props) => {
  const {
    isLoading,
    form,
    isPossibleToCalculate,
    findTotalsObject,
    filteredItems,
    findCalculationItem,
    findCalculationTitle,
    getCurrentScopes,
    getCurrentTerms,
    budgetTotalsSum,
    budgetTotals,
    selectedScopeExists,
    selectedTermExists,
    selectedTermTypeIsMonthly,
    hasExpired,
  } = useProjectTotals(
    props.selectedScopeId,
    props.selectedTermId,
    props.totalNav,
    props.projectIsUpdated,
  );

  return (
    <>
      <section className='w-[94%] mx-8 xl:mx-0 xl:ml-0 xl:w-[32%]'>
        <div className='w-full border border-zinc-200 p-9 rounded-md mt-12 text-zinc-700 bg-white'>
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
              <FormProvider {...form}>
                <form className='flex gap-3 items-center'>
                  <h2 className='font-bold text-xl mb-3'>Totals</h2>

                  <div>
                    {selectedScopeExists ? (
                      <p className='bg-indigo-600 px-2.5 py-1 text-xs text-white rounded-2xl flex items-center gap-2 mb-3'>
                        <span>
                          {budgetTotalsSum?.find(
                            (budget) => budget.budgetId === props.selectedScopeId,
                          )?.budget_name ?? 'Untitled'}
                        </span>
                        <span
                          className='cursor-pointer'
                          onClick={() => {
                            form.setValue('selected_scope', 'all');
                            props.setSelectedScopeId?.(null);

                            form.setValue('selected_term', 'all');
                            props.setSelectedTermId?.(null);
                          }}
                        >
                          <X size={10} stroke='white' />
                        </span>
                      </p>
                    ) : (
                      <AdvancedSelect
                        key={getCurrentScopes()
                          .map((s) => s.id)
                          .join('-')}
                        list={getCurrentScopes()}
                        inputName='selected_scope'
                        inputClassName='text-xs py-1 px-2 h-7 focus:ring-zinc-700 hover:bg-gray-200'
                        className='w-28 -mb-1'
                        dropDownStyles='top-7'
                        onChangeHandler={(e) => {
                          props.setSelectedScopeId?.(e.id === 'all' ? null : +e.id);
                        }}
                        doNotLeavePlaceForError={true}
                      />
                    )}
                  </div>

                  <div>
                    {selectedTermExists ? (
                      <p className='bg-indigo-600 px-2.5 py-1 text-xs text-white rounded-2xl flex items-center gap-2 mb-3'>
                        <span>
                          {budgetTotals?.by_phase?.find(
                            (term) => term.term_id === props.selectedTermId,
                          )?.term_name ?? 'Untitled'}
                        </span>
                        <span
                          className='cursor-pointer'
                          onClick={() => {
                            form.setValue('selected_term', 'all');
                            props.setSelectedTermId?.(null);
                          }}
                        >
                          <X size={10} stroke='white' />
                        </span>
                      </p>
                    ) : (
                      <AdvancedSelect
                        key={getCurrentTerms()
                          .map((t) => t.id)
                          .join('-')}
                        list={getCurrentTerms()}
                        inputName='selected_term'
                        inputClassName='text-xs py-1 px-2 h-7 focus:ring-zinc-700 hover:bg-gray-200'
                        className='w-28 -mb-1'
                        dropDownStyles='top-7'
                        onChangeHandler={(e) => {
                          const termId = e.id === 'all' ? null : +e.id;
                          props.setSelectedTermId?.(termId);

                          if (termId) {
                            const scope = budgetTotalsSum?.find((budget) =>
                              budget.by_phase.find((term) => term.term_id === termId),
                            );
                            props.setSelectedScopeId?.(scope ? scope.budgetId : null);
                          }

                          props.setTotalNav('total');
                        }}
                        doNotLeavePlaceForError={true}
                      />
                    )}
                  </div>
                </form>
              </FormProvider>

              <nav className='flex gap-2 items-center text-xs'>
                <p
                  className={twMerge(
                    'border border-gray-100 hover:bg-gray-100 rounded-xl px-2.5 py-1 cursor-pointer bg-white',
                    props.totalNav === 'total' &&
                      'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white',
                  )}
                  onClick={() => {
                    props.setTotalNav('total');
                    analytics.track('Project Total - Total');
                  }}
                >
                  Total
                </p>
                <p
                  className={twMerge(
                    'border border-gray-100 hover:bg-gray-100 rounded-xl px-2.5 py-1 cursor-pointer bg-white',
                    props.totalNav === 'month' &&
                      'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white',
                  )}
                  onClick={() => {
                    props.setTotalNav('month');
                    analytics.track('Project Total - By month');
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
                      analytics.track('Project Total - By phase');
                    }}
                  >
                    By phase
                  </p>
                )}
              </nav>

              {props.totalNav === 'total' && (
                <section className='mt-8 text-sm'>
                  {!selectedTermTypeIsMonthly || (
                    <div className='flex justify-between items-center mb-2'>
                      <p>Monthly fee</p>

                      <div className={` flex items-center`}>
                        <span>{getCurrencySymbol(props.currency)}</span>
                        {convertNumbersAsPrice(findTotalsObject()?.fee ?? 0)}
                      </div>
                    </div>
                  )}
                  <div className='flex justify-between items-center mb-2'>
                    <p>Subtotal</p>

                    <div className={`flex items-center`}>
                      <span>{getCurrencySymbol(props.currency)}</span>
                      {convertNumbersAsPrice(findTotalsObject()?.subtotal ?? 0)}
                    </div>
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

                  {!props.selectedTermId && hasExpired && (
                    <div className='flex items-center gap-1 mt-8'>
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>Expired phases are not calculated in totals</p>
                    </div>
                  )}
                </section>
              )}

              {props.totalNav !== 'total' && (
                <section className='mt-8 text-sm flex flex-col gap-3 leading-6'>
                  <div className='grid grid-cols-12'>
                    <p
                      className={twMerge(
                        'col-span-2 font-bold',
                        props.totalNav === 'month' && 'col-span-3',
                      )}
                    ></p>
                    <p className='col-span-3 font-bold'>Revenue</p>
                    <p className='col-span-3 font-bold'>Costs</p>
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
                                (
                                {Number.isFinite(calculation.profit_margin)
                                  ? calculation.profit_margin.toFixed(0)
                                  : 0}
                                %)
                              </span>
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {!props.selectedTermId && hasExpired && (
                    <div className='flex items-center gap-1 mt-2'>
                      <BlueExclamationCircle width='26' height='26' className='shrink-0' />
                      <p className='text-xs m-0'>Expired phases are not calculated in totals</p>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectTotals;
