import { Props } from './types';
import { useBudgetingPhaseListingItem } from './useBudgetingPhaseListingItem';
import {
  AddButton,
  BasicSelect,
  CalendarIcon,
  Circle,
  NormalInput,
  PhaseTableRow,
  ProgressCircle,
  ThreeDots,
  TickCircle,
  TickOutline,
  BudgetDiscountSection,
  ErrorModal,
  PortalWrapper,
  TrashCan,
  TransformedInput,
  HourGlass,
  InfoCircle,
  ProjectPlanListFooter,
  NewTab,
  TrashCanWithVerticalLines,
  BlueExclamationCircle,
  MoveTermModal,
  ChangeScopeModal,
} from 'components';
import { getBillingText, getTermStatus } from 'components/projects/helper';
import { Billing, TermStatus } from 'types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  allowOnlyNumbersInInput,
  analytics,
  can,
  formatDate,
  onEndDateChange,
  onMonthlyDurationChange,
  onPhaseTypeChange,
  onStartDateChange,
} from 'helpers';

const BudgetingPhaseListingItem: React.FC<Props> = (props) => {
  const {
    removeNodes,
    getValues,
    addNewRole,
    fields,
    updateOnBlurHandler,
    progress,
    removeRoleHandler,
    onDragEnd,
    togglePhase,
    buttonRef,
    dropDownRef,
    isActionsClicked,
    deleteDialog,
    setDeleteDialog,
    ref,
    isPhaseActionsDisabled,
    duplicatePhaseHandler,
    phaseType,
    toggleDuration,
    durationBtnRef,
    durationDropDownRef,
    isDurationOpen,
    register,
    months,
    days,
    monthsAndDaysExists,
    activateTermHandler,
    isActivateOpen,
    setIsActivateOpen,
    setValue,
    termsToMove,
    setTermsToMove,
    scopeToMoveTo,
    setScopeToMoveTo,
    editPhaseId,
    bulkMovePhasesHandler,
  } = useBudgetingPhaseListingItem(
    props.isOpen,
    props.i,
    props.setBudgetIsUpdated,
    props.inputName,
    props.publishedBudgetIsInEditMode!,
    props.arePublicHolidaysCounted,
    props.setIsSaving,
    props.setBudgetPhaseListingItemEdited,
    props.calculateProgress,
    props.updateBudgetAfterRateCardRemoved,
    props.updateBudgetDates,
    props.append,
    props.rateCardId,
    props.isProjectPage ? undefined : props.projectId,
    props.isProjectPage,
    props.phases,
    props.budget,
    props.budgets,
    props.setTermsAndBudgetsIsLoading,
    props.setOpenDeleteBudgetModal,
    props.getTermsAndBudgets,
    props.setProjectIsUpdated,
  );

  const openTermDropdown = () => {
    props.setIsOpen(props.isProjectPage ? props.phaseId : props.i + 1);
    props.setSelectedScopeId?.(getValues(`${props.inputName}.budget_id`) ?? null);
    props.setSelectedTermId(
      getValues(`${props.inputName}.item_id`) ?? getValues(`${props.inputName}.id`),
    );
    props.setSubtotalEditIsActive?.(false);
    props.setTotalNav((prev) => (prev === 'phase' ? 'total' : prev));
    props.isProjectPage
      ? analytics.track(`Open phase dropdown in Projects`)
      : analytics.track(`Open phase dropdown in Budgets`);
  };

  const termStatus = getValues(`${props.inputName}.status`) as TermStatus;
  const termActiveStatus =
    new Date(getValues(`${props.inputName}`)?.start_date) > new Date()
      ? 'upcoming'
      : new Date(getValues(`${props.inputName}`)?.end_date!) < new Date()
      ? 'completed'
      : 'ongoing';
  new Date(getValues(`${props.inputName}`)?.start_date);

  return (
    <section
      className={`grid ${
        props.isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      } transition-all duration-300 ease-out pt-3`}
    >
      {deleteDialog && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this phase?'
            modalTitle='Delete phase'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              setDeleteDialog(false);
            }}
            confirmFunction={() => {
              props.removePhaseHandler?.(+getValues(`${props.inputName}.item_id`)!, props.i!);
              setDeleteDialog(false);
            }}
          />
        </PortalWrapper>
      )}
      {!!termsToMove.length && props.openDeleteBudgetModal && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage={`Moving this phase will delete following scope: ${
              props.budget?.title || 'Untitled'
            }`}
            modalTitle='Delete scope'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              props.setOpenDeleteBudgetModal?.(false);
              setScopeToMoveTo(undefined);
            }}
            confirmFunction={() => {
              bulkMovePhasesHandler(scopeToMoveTo!, termsToMove, true);
              props.setOpenDeleteBudgetModal?.(false);
            }}
          />
        </PortalWrapper>
      )}
      {!!termsToMove.length && !props.openDeleteBudgetModal && !props.budgetWhichTermsToMove && (
        <PortalWrapper>
          <MoveTermModal
            termName={
              props.budget?.phase?.find((term) => term.id === termsToMove[0])?.name?.trim() ||
              'Untitled'
            }
            budgets={
              props.budgets
                ?.filter((b) => b.id !== props.budget?.id)
                ?.map((budget) => ({
                  id: budget.id,
                  title: budget.title || 'Untitled',
                })) ?? []
            }
            onSubmit={(budgetId) => bulkMovePhasesHandler(`${budgetId!}`, termsToMove)}
            onClose={() => setTermsToMove([])}
            projectId={props.projectId as number}
          />
        </PortalWrapper>
      )}
      {!props.openDeleteBudgetModal && props.budgetWhichTermsToMove && (
        <PortalWrapper>
          <ChangeScopeModal
            onClose={() => {
              props.setBudgetWhichTermsToMove?.(undefined);
              setTermsToMove([]);
            }}
            onSubmit={bulkMovePhasesHandler}
            currentPhases={
              props.budget?.phase?.map((phase) => ({
                id: phase.id!,
                name: phase.name || 'Untitled',
              })) ?? []
            }
            availableScopes={
              props.budgets
                ?.filter((b) => b.id !== props.budget?.id)
                ?.map((budget) => ({
                  id: budget.id as number,
                  title: budget.title || 'Untitled',
                })) ?? []
            }
            projectId={props.projectId as number}
          />
        </PortalWrapper>
      )}
      {isActivateOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Activate'
            modalMessage='Are you sure you want to activate this phase?'
            modalTitle='Activate phase'
            confirmButtonColor='bg-indigo-500'
            confirmButtonFocusColor='focus:ring-indigo-800'
            confirmButtonHoverColor='hover:bg-indigo-700'
            icon={<BlueExclamationCircle className='h-10 w-10' />}
            iconBackgroundColor=''
            closeHandler={() => setIsActivateOpen(false)}
            confirmFunction={() => {
              activateTermHandler();
              setIsActivateOpen(false);
            }}
          />
        </PortalWrapper>
      )}
      <div
        className={` bg-white border border-zinc-200 rounded-md p-4 w-full transition-all duration-300 relative ${
          !props.isOpen
            ? `${!props.isProjectPage ? 'h-[3.625rem]' : 'h-28'}  hover:bg-zinc-100`
            : `min-h-[4.5rem]`
        }  ${
          !props.isOpen && props.isReadOnly ? 'cursor-pointer' : ''
        } transition-opacity ease-in flex flex-col items-start 'min-h-[4.5rem]`}
        onClick={openTermDropdown}
      >
        <div className='flex items-center justify-between -mt-2 w-full' onClick={openTermDropdown}>
          <div className='w-full flex items-center justify-between '>
            <div className='flex items-center justify-between w-[50%]'>
              {props.isReadOnly ? (
                <div
                  className='text-sm font-medium text-zinc-700 truncate w-44 2xl:w-54 cursor-pointer pt-2'
                  title={getValues(`${props.inputName}.name`)}
                >
                  {getValues(`${props.inputName}.name`)}
                </div>
              ) : (
                <TransformedInput
                  inputName={`${props.inputName}.name`}
                  placeholder='Untitled'
                  className='border-none! bg-transparent! focus:ring-0 focus:border-transparent w-full text-ellipsis placeholder:text-zinc-400 focus:outline-hidden text-zinc-700'
                  containerClasses='w-[65%]!'
                  blurHandler={() => {
                    updateOnBlurHandler();
                    analytics.track('Phase name');
                  }}
                  canNotEdit={props.isReadOnly}
                  displayValue={
                    getValues(`${props.inputName}.name`) ? (
                      <div
                        className='text-zinc-700  w-full truncate'
                        title={getValues(`${props.inputName}.name`)}
                      >
                        {' '}
                        {getValues(`${props.inputName}.name`)}
                      </div>
                    ) : (
                      <div className='text-zinc-400  w-16 truncate'> Untitled</div>
                    )
                  }
                />
              )}
              {props.isReadOnly ? (
                <div className='px-2.5! py-1 mt-2 text-xs! rounded-md max-h-[1.625rem] font-medium! text-zinc-700 bg-gray-50 cursor-pointer'>
                  {getBillingText(getValues(`${props.inputName}.type`), true)}
                </div>
              ) : (
                <BasicSelect
                  inputName={`${props.inputName}.type`}
                  list={['default', 'fixed', 'monthly']}
                  inputClassName='px-2.5! py-1! text-xs! rounded-md max-h-[1.625rem] font-medium! disabled:text-zinc-700!'
                  dropDownStyles='[&>li]:text-xs! text-left text-[#394049] gap-0 top-6! w-36!'
                  className={`${
                    getValues(`${props.inputName}.type`) == 'monthly' ? 'w-20!' : 'w-16!'
                  } `}
                  chevronStyles='right-2!'
                  externalOptionTextRenderer={(t) => getBillingText(t as Billing, true)}
                  externalOptionTextOnChange={(t) => getBillingText(t as Billing, true)}
                  isTableCell
                  noSearch
                  removeChangeOnFocus
                  onChangeHandler={() => {
                    updateOnBlurHandler((setValue, terms) => {
                      onPhaseTypeChange(setValue, props.i!, terms);
                    });
                    analytics.track('Phase type');
                  }}
                  canNotEdit={props.isReadOnly}
                />
              )}
            </div>
            <div className='flex items-center w-full gap-5 pl-[4%]'>
              <div className='flex items-center justify-start text-xs text-zinc-700 gap-1 relative w-[75%]'>
                <div
                  className={`${
                    props.isReadOnly ? '-top-2!' : '-top-1'
                  } flex items-start gap-1 absolute left-3 w-full `}
                >
                  <div
                    className={`${props.isProjectPage ? 'w-full' : 'w-1/3'} flex items-start gap-1`}
                  >
                    <div
                      className={`${
                        getValues(`${props.inputName}.start_date`) ? '-mt-2' : ''
                      }  flex flex-col items-start text-xs text-zinc-700 cursor-pointer`}
                    >
                      {getValues(`${props.inputName}.start_date`) && !props.isProjectPage && (
                        <p className='text-zinc-400 text-[8px]'>Start date</p>
                      )}
                      <div
                        className={`${
                          props.isProjectPage ? 'pt-1' : ''
                        } flex items-center justify-center`}
                      >
                        {(!getValues(`${props.inputName}.start_date`) || props.isProjectPage) && (
                          <CalendarIcon
                            className={`${props.isProjectPage ? 'w-4 mt-1 pr-1' : 'w-6 -mt-3'} `}
                            color={
                              getValues(`${props.inputName}.start_date`) ? '#5A636F' : '#4F46E5'
                            }
                          />
                        )}
                        {props.isReadOnly ? (
                          <div className='pt-[0.2rem] cursor-pointer text-[#5A636F]'>
                            {props.isProjectPage
                              ? `${formatDate(getValues(`${props.inputName}.start_date`)!)} -
                                ${formatDate(getValues(`${props.inputName}.end_date`)!)}`
                              : formatDate(getValues(`${props.inputName}.start_date`)!)}
                          </div>
                        ) : (
                          <NormalInput
                            inputName={`${props.inputName}.start_date`}
                            type='date'
                            placeholderText='Set start date'
                            className='placeholder:text-indigo-600! text-xs! text-[#5A636F]! pl-0! pt-0.5! border-none! bg-transparent! font-medium py-0! focus:ring-transparent! focus:ring-0! focus:border-transparent! outline-hidden! focus:outline-hidden!'
                            hideDate
                            isTableCell
                            blurHandler={() => {
                              !getValues(`${props.inputName}.start_date`) &&
                                setValue(`${props.inputName}.end_date`, '');
                              updateOnBlurHandler(
                                (setValue, terms) => {
                                  onStartDateChange(setValue, props.i!, terms);
                                },
                                false,
                                false,
                                true,
                              );
                              analytics.track('Start date');
                            }}
                            canNotEdit={props.isReadOnly}
                            maxDate={
                              !!getValues(`${props.inputName}.end_date`)!
                                ? new Date(getValues(`${props.inputName}.end_date`)!)
                                : null
                            }
                            doNotExcludeHolidays={props.arePublicHolidaysCounted ?? false}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {!props.isProjectPage && (
                    <div className={`flex items-start gap-1 w-1/3`}>
                      <div className='flex flex-col items-start text-xs text-zinc-700 cursor-pointer -mt-2'>
                        <p className='text-zinc-400 text-[8px]'>End date</p>
                        {props.isReadOnly ? (
                          <div className='pt-[0.2rem] cursor-pointer text-[#5A636F]'>
                            {formatDate(getValues(`${props.inputName}.end_date`)!)}
                          </div>
                        ) : (
                          <NormalInput
                            inputName={`${props.inputName}.end_date`}
                            type='date'
                            placeholderText='dd/mm/yyyy'
                            className='text-xs! disabled:!pointer-none text-[#5A636F]! pl-0! pt-0.5! border-none! bg-transparent! font-medium py-0! focus:ring-transparent! focus:ring-0! focus:border-transparent! outline-hidden! focus:outline-hidden!'
                            hideDate
                            isTableCell
                            blurHandler={() => {
                              updateOnBlurHandler(
                                (setValue, terms) => {
                                  onEndDateChange(setValue, props.i!, terms);
                                },
                                false,
                                true,
                              );
                              analytics.track('End date');
                            }}
                            canNotEdit={
                              props.isReadOnly || !getValues(`${props.inputName}.start_date`)
                            }
                            minDate={new Date(getValues(`${props.inputName}.start_date`))}
                            externalKeyDown={(e) => e.preventDefault()}
                            doNotExcludeHolidays={props.arePublicHolidaysCounted ?? false}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {getValues(`${props.inputName}.type`) === 'monthly' ? (
                    <button
                      className={`${
                        monthsAndDaysExists || props.isProjectPage
                          ? 'text-[#5A636F]'
                          : 'text-indigo-600'
                      } ${
                        getValues(`${props.inputName}.type`) === 'monthly' && !props.isProjectPage
                          ? 'opacity-100 hover:opacity-80'
                          : props.isProjectPage
                          ? 'opacity-100'
                          : 'hidden cursor-default'
                      } ${props.isProjectPage ? 'left-48 w-36 pt-0!' : 'left-30  w-1/3'} ${
                        props.isReadOnly ? 'pt-1.5' : 'pt-0.5'
                      } flex items-center gap-0.5 text-2xs font-medium cursor-pointer`}
                      onClick={() => {
                        toggleDuration(
                          () =>
                            !props.isReadOnly &&
                            updateOnBlurHandler((setValue, terms) => {
                              onMonthlyDurationChange(setValue, props.i!, terms);
                            }),
                        );
                      }}
                      ref={durationBtnRef}
                      disabled={getValues(`${props.inputName}.type`) !== 'monthly'}
                      type='button'
                    >
                      <HourGlass
                        color={`${
                          monthsAndDaysExists || props.isProjectPage ? '#5A636F' : '#4F46E5'
                        }`}
                      />
                      {!props.isProjectPage ? (
                        monthsAndDaysExists ? (
                          `${months ? months : 0} ${+months! > 1 ? 'months' : 'month'},
                      ${days ? days : 0} ${+days! > 1 ? 'days' : 'day'}`
                        ) : (
                          'Add duration'
                        )
                      ) : (
                        <p className='text-[#5A636F] font-normal text-2xs'>
                          {getValues(`${props.inputName}.work_days_count`)} work days
                        </p>
                      )}
                    </button>
                  ) : (
                    !props.isProjectPage && (
                      <>
                        <div className='flex flex-col items-start text-xs text-zinc-700 cursor-pointer -mt-2'>
                          <p className='text-zinc-400 text-[8px]'>Phase duration</p>
                          <p
                            className={`${
                              getValues(`${props.inputName}.work_days_count`)
                                ? 'text-[#5A636F]'
                                : 'text-zinc-400'
                            } text-xs`}
                          >{`${
                            getValues(`${props.inputName}.work_days_count`)
                              ? `${getValues(`${props.inputName}.work_days_count`)} w/d`
                              : 'N/A'
                          }`}</p>
                        </div>
                      </>
                    )
                  )}
                </div>

                {isDurationOpen && (
                  <div
                    ref={durationDropDownRef}
                    className='absolute top-6 left-30 shadow-md border border-gray-100 bg-white rounded-sm w-64 h-32 p-4 z-999'
                  >
                    <p className='text-zinc-400 text-2xs pb-2'>Set phase duration</p>
                    <div className='flex items-center gap-[0.438rem]'>
                      <div className='flex items-center gap-1 bg-gray-50 rounded-md border border-zinc-160 w-19.5 px-2.5'>
                        <input
                          type='text'
                          {...register(`${props.inputName}.months`)}
                          placeholder='0'
                          onBlur={() => {
                            updateOnBlurHandler((setValue, terms) => {
                              onMonthlyDurationChange(setValue, props.i!, terms);
                            });
                            analytics.track('Phase duration - months');
                          }}
                          onKeyDown={(e) => allowOnlyNumbersInInput(e)}
                          disabled={props.isReadOnly}
                          className='w-1/2 px-0 h-[1.875rem] bg-transparent border-none outline-hidden text-sm  focus:border-none focus:outline-hidden focus:ring-0'
                        />
                        <p className='w-1/2 text-[#5A636F] text-2xs'>Month</p>
                      </div>
                      <div className='flex items-center gap-1 bg-gray-50 rounded-md border border-zinc-160 w-19.5 px-2.5'>
                        <input
                          type='text'
                          {...register(`${props.inputName}.days`)}
                          placeholder='0'
                          onBlur={() => {
                            updateOnBlurHandler((setValue, terms) => {
                              onMonthlyDurationChange(setValue, props.i!, terms);
                            });
                            analytics.track('Phase duration - days');
                          }}
                          onKeyDown={(e) => allowOnlyNumbersInInput(e)}
                          disabled={props.isReadOnly}
                          className='w-1/2 px-0 h-[1.875rem] bg-transparent border-none outline-hidden text-sm  focus:border-none focus:outline-hidden focus:ring-0'
                        />
                        <p className='w-1/2 text-[#5A636F] text-2xs'>Day</p>

                        <div className='group relative before:absolute before:-top-1 before:z-10 before:hidden before:h-2.5 before:w-2.5 before:translate-x-1/2  before:-translate-y-full before:rotate-45 before:border-r before:border-b before:border-gray-300 before:bg-white before:content-[""] hover:before:block'>
                          <div className='absolute -top-2 hidden -translate-x-[10%] -translate-y-full whitespace-nowrap rounded-lg border border-gray-300 bg-white p-2 text-[#5A636F] group-hover:block'>
                            Calendar days
                          </div>
                          <InfoCircle className='w-3 h-3 shrink-0' />
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-0.5 pt-6 text-2xs text-[#5A636F]'>
                      <HourGlass />
                      <p className='pt-px'>
                        {' '}
                        Phase duration will be {months ? months : 0}{' '}
                        {+months! > 1 ? 'months' : 'month'} and {days ? days : 0}{' '}
                        {+days! > 1 ? 'days' : 'day'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>{' '}
          </div>
          {props.isReadOnly || (
            <>
              <div className='relative w-[20%] mt-2' ref={ref}>
                <div className='group'>
                  {progress?.fieldQuantity! < progress?.allFieldsCount! ? (
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <ProgressCircle
                        progress={progress?.filledPercentage!}
                        baseColor='#F1F2F4'
                        fillColor='#059669'
                        size={1.125}
                        innerSize={1}
                        hideContent
                      />
                      <p className='text-xs text-zinc-700'>{`${progress?.fieldQuantity}/${progress?.allFieldsCount} actions`}</p>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <TickCircle className='w-6 h-6' />
                      <p className='text-xs text-zinc-700'>Ready to book</p>
                    </div>
                  )}

                  <ul
                    className={` hidden group-hover:flex  absolute z-50  w-56 bg-white rounded-md p-4 flex-col gap-2 border border-zinc-200`}
                    style={{ top: 32 }}
                  >
                    {progress?.progressList?.map((list) => (
                      <li key={list.title} className='flex items-center gap-1.5 text-xs'>
                        {list.filled ? <TickOutline /> : <Circle />}
                        {list.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {!props.isProjectPage || (
            <div className='flex items-center justify-center h-[2.688rem] pt-2 mr-1'>
              <div
                className={`${
                  termStatus === 'booked' || termStatus === 'expired'
                    ? getTermStatus(termStatus)?.color
                    : getTermStatus(termActiveStatus)?.color
                } ${
                  termStatus === 'expired' ? 'w-[6.5rem]' : ''
                } uppercase text-2xs px-2 py-0.5 rounded-[19px]`}
              >
                {termStatus === 'booked' || termStatus === 'expired'
                  ? getTermStatus(termStatus)?.title
                  : getTermStatus(termActiveStatus)?.title}
              </div>
              {termStatus === 'booked' && can('project::update', props.permissions) && (
                <button
                  type='button'
                  className='text-indigo-600 text-xs font-medium pl-2.5 hover:opacity-80'
                  onClick={() => setIsActivateOpen(true)}
                >
                  Activate
                </button>
              )}
              {termStatus === 'expired' && (
                <button
                  className='pl-2 hover:opacity-80'
                  onClick={() => props.deleteTermHandler?.(getValues(`${props.inputName}.id`))}
                >
                  <TrashCanWithVerticalLines size='14' color='#5A636F' />
                </button>
              )}
            </div>
          )}
          {(!props.isReadOnly || props.isProjectPage) &&
            can('project::update', props.permissions) && (
              <button
                ref={buttonRef}
                type='button'
                className={`${
                  isPhaseActionsDisabled ? 'opacity-0' : 'opacity-100'
                } hover:bg-zinc-200 hover:rounded-full py-1.5 px-1 mt-2 rotate-90 cursor-pointer`}
                onClick={togglePhase}
                disabled={!!isPhaseActionsDisabled}
              >
                <ThreeDots />
              </button>
            )}

          {isActionsClicked && (
            <div
              ref={dropDownRef}
              className='absolute right-6 z-9999 top-10 w-[10.313rem] overflow-hidden rounded-lg border  border-gray-300 bg-white text-sm shadow-lg'
            >
              {' '}
              {props.isProjectPage ? (
                <>
                  <a
                    href={`${props.budgetLink}&termId=${props.id}`}
                    target='_blank'
                    className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
                    onClick={() => props.isProjectPage && analytics.track('Edit phase in scope')}
                  >
                    <span>Edit phase in scope</span>
                    <NewTab size='16' color='#292D32' />
                  </a>
                  <button
                    type='button'
                    onClick={() => setTermsToMove([props.id])}
                    className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
                  >
                    <span>Move to another scope</span>
                  </button>
                </>
              ) : (
                <>
                  {!editPhaseId && (
                    <button
                      type='button'
                      onClick={() => duplicatePhaseHandler(props.i)}
                      className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
                    >
                      <span>Duplicate</span>
                    </button>
                  )}
                  <button
                    type='button'
                    onClick={() => {
                      if (
                        getValues(`${props.inputName}.employees`)?.length &&
                        !props.publishedBudgetIsInEditMode
                      ) {
                        {
                          setDeleteDialog(true);
                        }
                      } else {
                        props.removePhaseHandler?.(
                          +getValues(`${props.inputName}.item_id`)!,
                          props.i!,
                        );
                      }
                    }}
                    className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
                  >
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className={`${removeNodes} transition-opacity ease-in w-full `}>
          {!getValues(`${props.inputName}.employees`)?.length || (
            <>
              <div
                className={`grid grid-cols-21 grid-flow-row border font-medium bg-indigo-50 text-xs text-[#312E81] sticky top-0 mt-6 w-[99%]`}
              >
                <div className='col-span-4 py-2 border-r px-3'>Role</div>
                {phaseType === 'monthly' || (
                  <div className='col-span-4 py-2 border-r px-3'>Start on / Duration</div>
                )}
                <div className='col-span-3 py-2 border-r px-3'>Engagement</div>
                {!props.isProjectInternal && (
                  <div className='col-span-3 py-2 border-r px-3'>Hourly rate</div>
                )}
                {phaseType === 'monthly' && (
                  <div className='col-span-3 py-2 border-r px-3'>Total hours</div>
                )}
                {!props.isProjectInternal && (
                  <div className='col-span-3 py-2 border-r px-3'>Total budget</div>
                )}
                <div className='col-span-4 py-2 px-3'>Staffing</div>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={'one'}>
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className='relative'>
                      {fields?.map((item, index) => {
                        return (
                          <Draggable
                            draggableId={(item.id as string).toString()!}
                            index={index}
                            key={item.id}
                          >
                            {(provided) => (
                              <PhaseTableRow
                                provided={provided}
                                style={undefined}
                                inputName={`${props.inputName}.employees.${index}`}
                                roles={props.roles}
                                phaseIndex={props.i}
                                index={index}
                                minimalUsers={props.minimalUsers!}
                                updateOnBlurHandler={updateOnBlurHandler}
                                currency={props.currency}
                                currentPhaseName={`${props.inputName}.employees`}
                                removeRoleHandler={removeRoleHandler}
                                isReadOnly={props.isReadOnly}
                                openTermDropdown={openTermDropdown}
                                phaseType={phaseType}
                                projectPage={props.isProjectPage}
                                phaseStartDate={getValues(props.inputName).start_date}
                                phaseEndDate={getValues(props.inputName).end_date}
                                isProjectInternal={props.isProjectInternal}
                              />
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
          {props.isReadOnly || (
            <>
              {!getValues(`${props.inputName}.employees`)?.length ? (
                <AddButton
                  buttonText={'Add role'}
                  className='mt-5 bg-indigo-600 text-white rounded-md text-xs font-medium px-4 py-1.5'
                  onClick={addNewRole}
                />
              ) : (
                <div
                  className='text-xs text-[#5A636F] py-1.5 font-medium cursor-pointer hover:opacity-80'
                  onClick={addNewRole}
                >
                  + Add role
                </div>
              )}
            </>
          )}
          {!getValues(`${props.inputName}.employees`)?.length || (
            <BudgetDiscountSection
              updateOnBlurHandler={updateOnBlurHandler}
              currency={props.currency}
              i={props.i}
              budgetIsUpdated={props.budgetIsUpdated!}
              phaseIndex={props.i}
              isReadOnly={props.isReadOnly}
              inputName={props.inputName}
            />
          )}
        </div>
        {!props.isProjectPage || (
          <ProjectPlanListFooter
            currency={props.currency}
            gross_profit={getValues(`${props.inputName}.gross_profit`) ?? 0}
            cost={getValues(`${props.inputName}.cost`) ?? 0}
            total={(getValues(`${props.inputName}.total_to_be_paid`) as number) ?? 0}
            gross_profit_percentage={
              (getValues(`${props.inputName}.gross_profit_percentage`) as number) ?? 0
            }
            employees={getValues(`${props.inputName}.employees`)}
            minimalUsers={props.minimalUsers!}
          />
        )}
      </div>
    </section>
  );
};

export default BudgetingPhaseListingItem;
