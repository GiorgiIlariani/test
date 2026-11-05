import { Props } from './types';
import React, { ChangeEvent } from 'react';
import { usePhaseTableRow } from './usePhaseTableRow';
import {
  AdvancedSelect,
  DragIcons,
  ErrorModal,
  FreeOfChargeToggle,
  NewTab,
  NormalInput,
  PortalWrapper,
  ThreeDots,
  TransformedInput,
  TrashCan,
} from 'components';
import {
  renderEmployeeWithImage,
  employeesListWithSkillsOptionRenderer,
} from 'components/vacations/VacationsModal/helpers';
import {
  getErrorMessage,
  getCurrencySymbol,
  allowOnlyNumbersInInput,
  allowOnlyNumbersInInputWithDot,
  onDurationChange,
  onStartDayChange,
  onEngagementChange,
  onRateChange,
  onFreeOfChargeChange,
  onRoleChange,
  convertNumbersAsPrice,
  analytics,
  onEmployeeDateChange,
} from 'helpers';
import { AuthUser, Staff, StaffMinimalEmployee } from 'types';
import { twMerge } from 'tailwind-merge';

const PhaseTableRow: React.FC<Props> = (props) => {
  const {
    getStyle,
    formState,
    getValues,
    setValue,
    setIsHovered,
    isHovered,
    isActionsClicked,
    setIsActionsClicked,
    buttonRef,
    dropDownRef,
    toggleRoles,
    setListHandler,
    list,
    deleteRoleHandler,
    deleteDialog,
    setDeleteDialog,
    startDayIsHovered,
    setStartDayIsHovered,
    durationIsHovered,
    setDurationIsHovered,
    inputRef,
  } = usePhaseTableRow(props.inputName, props.minimalUsers, props.roles);

  return (
    <>
      {deleteDialog && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this role?'
            modalTitle='Delete role'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              setDeleteDialog(false);
            }}
            confirmFunction={() => {
              props.removeRoleHandler?.(props.index!, props.phaseIndex!);
            }}
          />
        </PortalWrapper>
      )}
      <li
        {...(props.projectPage ? {} : { ...props.provided.draggableProps })}
        {...(props.projectPage ? {} : { ...props.provided.dragHandleProps })}
        ref={!props.isReadOnly ? props.provided.innerRef : null}
        className={`${
          props.isReadOnly ? 'cursor-default' : 'hover:bg-white/20'
        }  group grid grid-cols-21  border-b border-x cursor-default! bg-white relative w-[99%]`}
        style={getStyle(props.provided, props.style!, props.isDragging!)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        {props.isReadOnly || (
          <>
            <button
              ref={buttonRef}
              type='button'
              disabled={props.isReadOnly}
              className={`${
                isHovered || isActionsClicked ? 'opacity-100' : 'opacity-0'
              } hover:bg-zinc-200 z-999 hover:rounded-full absolute -right-8 top-3  px-[0.8rem] py-1.5 flex items-center justify-center rotate-90 cursor-pointer`}
              onClick={toggleRoles}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
            >
              <ThreeDots />
            </button>
            {isHovered && !props.isReadOnly && (
              <>
                <div
                  className='w-4 h-4 cursor-grab! absolute -left-4 top-3'
                  {...props.provided.dragHandleProps}
                >
                  <DragIcons />
                </div>
              </>
            )}
            {isActionsClicked && (
              <div
                ref={dropDownRef}
                className='absolute -right-6 z-9999 top-10 w-[10.313rem] overflow-hidden rounded-lg border  border-gray-300 bg-white text-sm shadow-lg'
                onMouseLeave={() => {
                  setIsActionsClicked(false);
                  setIsHovered(false);
                }}
              >
                <button
                  type='button'
                  onClick={() =>
                    deleteRoleHandler(
                      () => props.removeRoleHandler?.(props.index!, props.phaseIndex!)!,
                    )
                  }
                  className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
                >
                  <span>Delete</span>
                </button>
                <button
                  type='button'
                  onClick={() => {}}
                  className='flex w-full gap-2.5 items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-100'
                >
                  <span>Free of charge</span>
                  <FreeOfChargeToggle
                    inputName={`${props.inputName}.is_free_of_charge`}
                    onChangeHandler={() => {
                      props.updateOnBlurHandler((setValue, terms) => {
                        onFreeOfChargeChange(setValue, props.phaseIndex!, props.index, terms);
                      });
                    }}
                    showProject={props.isReadOnly}
                  />
                </button>
              </div>
            )}
          </>
        )}
        <div className='flex flex-col relative col-span-4 border-r hover:bg-gray-100' title={''}>
          <AdvancedSelect
            inputName={`${props.inputName}.role`}
            list={props.roles}
            placeholder='Select role'
            externalButtonTextRenderer={(value) => {
              const role = getValues(`${props.inputName}.role`);

              if (!value) {
                return <span className='px-4 text-sm text-zinc-400'>Select role</span>;
              } else if (typeof value === 'string') {
                return (
                  <p className='px-4 text-sm truncate w-full' title={role}>
                    {role}
                  </p>
                );
              } else {
                const roleTitle = props.roles?.find((role) => +role.id === +value)?.title;
                return (
                  <p className='px-4 text-sm truncate w-full' title={roleTitle}>
                    {roleTitle}
                  </p>
                );
              }
            }}
            externalButtonClassName='top-2! w-full!'
            inputClassName={`border-none! bg-transparent! outline-hidden! focus:border-transparent focus:ring-indigo-600 rounded-none! focus:ring-1 bg-white text-sm disabled:bg-white disabled:text-zinc-700 `}
            isTableCell
            disableErrorIcon
            disableArrowIcon
            dropDownStyles='w-56! top-8!'
            externalOnListItemClickHandler={(id) => {
              setListHandler(id!);
              props.updateOnBlurHandler((setValue, terms) => {
                onRoleChange(setValue, props.phaseIndex!, props.index, terms);
              });
              analytics.track('Phase role');
            }}
            canNotEdit={props.isReadOnly}
            resetLists
          />
        </div>

        {props.phaseType === 'monthly' || (
          <div
            className='flex items-center relative col-span-4 border-r w-full hover:cursor-text'
            title={''}
          >
            <div
              className='flex items-center justify-center w-1/2 h-full gap-2 relative hover:bg-gray-100'
              onMouseEnter={() => setStartDayIsHovered(true)}
              onMouseLeave={() => setStartDayIsHovered(false)}
              onClick={() => setStartDayIsHovered(false)}
            >
              {' '}
              <TransformedInput
                inputName={`${props.inputName}.start_day`}
                className={twMerge(
                  'border-none! text-start outline-hidden! text-[#5A636F]! pl-4!  h-full w-full text-xs! focus:ring-indigo-600 focus:ring-1 bg-transparent! placeholder:text-zinc-200',
                )}
                placeholder=''
                blurHandler={(e) => {
                  if (+(e as ChangeEvent<HTMLInputElement>)?.target.value! == 0) {
                    setValue(`${props.inputName}.start_day`, 1);
                  }
                  props.updateOnBlurHandler((setValue, terms) => {
                    onStartDayChange(setValue, props.phaseIndex!, props.index, terms);
                  });
                  analytics.track('Phase role start day');
                }}
                externalKeyDown={(e) => {
                  if (e.key !== 'Tab') {
                    allowOnlyNumbersInInput(e);
                  }
                }}
                canNotEdit={props.isReadOnly}
                displayValue={
                  startDayIsHovered && getValues(`${props.inputName}.start_date`) ? (
                    <div className='text-[#5A636F] text-2xs flex items-center gap-2 w-full'>
                      <p>
                        {new Date(getValues(`${props.inputName}.start_date`)).toLocaleDateString(
                          'de-DE',
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className='text-[#5A636F] text-xs flex items-center gap-2 w-full'>
                      Day <span>{getValues(`${props.inputName}.start_day`)}</span>
                    </p>
                  )
                }
                containerClasses='w-full h-full'
                externalButtonClassName='h-full flex items-center justify-center pl-5 top-0!'
              />
              {startDayIsHovered && (
                <div
                  className='absolute right-4 top-0.5 z-50 w-5 h-5 -mt-0.5'
                  onClick={(e) => e.stopPropagation()}
                >
                  <NormalInput
                    inputName={`${props.inputName}.start_date`}
                    type='date'
                    placeholderText=''
                    className='hidden'
                    isTableCell
                    blurHandler={() => {
                      setValue(`${props.inputName}.start_date_updated`, true);
                      setStartDayIsHovered(false);
                      props.updateOnBlurHandler((setValue, terms) => {
                        onEmployeeDateChange(setValue, props.phaseIndex!, props.index, terms);
                      });
                      analytics.track('Phase role start date');
                    }}
                    canNotEdit={props.isReadOnly}
                    externalKeyDown={(e) => {
                      if (e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    openDatePickerOnCalendarClick
                    calendarIconStyles='w-4 h-4'
                    minDate={props.phaseStartDate ? new Date(props.phaseStartDate) : undefined}
                    maxDate={props.phaseEndDate ? new Date(props.phaseEndDate) : undefined}
                  />
                </div>
              )}
            </div>
            <div className='bg-zinc-200 h-[60%] w-px' />
            <div
              className='flex items-center justify-center w-1/2 h-full gap-2 relative hover:bg-gray-100'
              onMouseEnter={() => setDurationIsHovered(true)}
              onMouseLeave={() => setDurationIsHovered(false)}
              onClick={() => {
                setDurationIsHovered(false);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }}
            >
              <NormalInput
                inputName={`${props.inputName}.duration`}
                className={twMerge(
                  'border-none! outline-hidden! focus:ring-indigo-600 focus:ring-1 px-4! focus:border-transparent rounded-none! bg-transparent! placeholder:text-zinc-200 disabled:text-zinc-700!',
                  durationIsHovered && 'hidden',
                )}
                placeholder=''
                isTableCell
                blurHandler={() => {
                  props.updateOnBlurHandler((setValue, terms) => {
                    onDurationChange(setValue, props.phaseIndex!, props.index, terms);
                  });
                  analytics.track('Phase role duration');
                }}
                externalKeyDown={(e) => {
                  if (e.key !== 'Tab') {
                    allowOnlyNumbersInInput(e);
                  }
                }}
                containerClasses={'w-full hover:bg-gray-100'}
                canNotEdit={props.isReadOnly}
                externalRef={inputRef}
              />
              {durationIsHovered && (
                <div
                  className='absolute left-4 top-0.5 z-50 h-5 flex justify-start items-center hover:cursor-text'
                  onClick={() => {
                    setDurationIsHovered(false);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }}
                >
                  {getValues(`${props.inputName}.end_date`) ? (
                    <div className='text-[#5A636F] text-2xs w-full mt-4 text-left'>
                      {new Date(getValues(`${props.inputName}.end_date`)).toLocaleDateString(
                        'de-DE',
                      )}
                    </div>
                  ) : (
                    <div className='text-[#5A636F] text-sm flex justify-end w-full mt-4 text-left'>
                      <span>{getValues(`${props.inputName}.duration`)}</span>
                    </div>
                  )}
                </div>
              )}
              {durationIsHovered && (
                <div
                  className='absolute right-4 top-0.5 z-50 w-5 h-5 flex items-center hover:cursor-text'
                  onClick={(e) => e.stopPropagation()}
                >
                  <NormalInput
                    inputName={`${props.inputName}.end_date`}
                    type='date'
                    placeholderText=''
                    className='hidden'
                    isTableCell
                    blurHandler={() => {
                      setValue(`${props.inputName}.end_date_updated`, true);
                      setDurationIsHovered(false);
                      props.updateOnBlurHandler((setValue, terms) => {
                        onEmployeeDateChange(setValue, props.phaseIndex!, props.index, terms);
                      });
                      analytics.track('Phase role end date');
                    }}
                    canNotEdit={props.isReadOnly}
                    externalKeyDown={(e) => {
                      if (e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    openDatePickerOnCalendarClick
                    calendarIconStyles='w-4 h-4'
                    minDate={props.phaseStartDate ? new Date(props.phaseStartDate) : undefined}
                    maxDate={props.phaseEndDate ? new Date(props.phaseEndDate) : undefined}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className='flex items-center relative col-span-3 border-r w-full h-full hover:bg-gray-100'
          title={''}
        >
          <TransformedInput
            inputName={`${props.inputName}.engagement`}
            className='border-none! outline-hidden! px-3! w-full h-full focus:ring-indigo-600 focus:ring-1  focus:border-transparent  bg-transparent! placeholder:text-zinc-200'
            placeholder=''
            blurHandler={(e) => {
              const value = e?.target?.value;
              setValue(
                `${props.inputName}.engagement`,
                value?.includes('%') ? value?.slice(0, -1) : value,
              );
              props.updateOnBlurHandler((setValue, terms) => {
                onEngagementChange(setValue, props.phaseIndex!, props.index, terms);
              }, true);
              analytics.track('Phase role engagement');
            }}
            externalKeyDown={(e) => {
              if (e.key !== 'Tab') {
                allowOnlyNumbersInInputWithDot(e);
              }
            }}
            externalOnChange={(e) => {
              const value = e?.target.value as unknown as number;
              if (value! >= 100) {
                setValue(`${props.inputName}.engagement`, 100);
              }
            }}
            externalButtonClassName='px-3! top-[0.2rem]! flex items-center w-full h-full'
            containerClasses='w-full h-full'
            canNotEdit={props.isReadOnly}
            displayValue={
              getValues(`${props.inputName}.engagement`) ? (
                <p>
                  {' '}
                  {Math.round(getValues(`${props.inputName}.engagement`))}{' '}
                  <span className='text-2xs'>%</span>
                </p>
              ) : (
                <span className='text-sm text-zinc-200'>%</span>
              )
            }
          />
        </div>
        {!props.isProjectInternal && (
          <div
            className='flex  items-center relative col-span-3 border-r hover:bg-gray-100'
            title={''}
          >
            <TransformedInput
              inputName={`${props.inputName}.rate`}
              placeholder=''
              blurHandler={() => {
                props.updateOnBlurHandler((setValue, terms) => {
                  onRateChange(setValue, props.phaseIndex!, props.index, terms);
                }, true);
                analytics.track('Phase role rate');
              }}
              className='border-none! outline-hidden! px-3! placeholder:text-zinc-200 h-full w-full focus:border-transparent focus:ring-indigo-600 focus:ring-1 bg-transparent!'
              externalKeyDown={(e) => {
                if (e.key !== 'Tab') {
                  allowOnlyNumbersInInputWithDot(e);
                }
              }}
              externalButtonClassName='flex items-center w-full h-full px-3!'
              containerClasses='h-full w-full'
              canNotEdit={props.isReadOnly}
              displayValue={
                getValues(`${props.inputName}.rate`) ? (
                  <div className='flex items-center gap-2'>
                    {' '}
                    <p className=''> {getCurrencySymbol(props.currency)}</p>
                    {Math.round(getValues(`${props.inputName}.rate`))}{' '}
                  </div>
                ) : (
                  <span className='text-sm text-zinc-200'>$</span>
                )
              }
            />
          </div>
        )}

        {props.phaseType !== 'monthly' || (
          <div
            className='flex relative col-span-3 border-r  bg-gray-50 px-3! text-sm items-center'
            title={''}
          >
            <>
              {getValues(`${props.inputName}.hours`) ?? 0}{' '}
              {getValues(`${props.inputName}.hours`) <= 1 ? 'hr' : 'hrs'}
            </>
          </div>
        )}

        {!props.isProjectInternal && (
          <div
            className='flex relative col-span-3 border-r  bg-gray-50 px-3! text-sm items-center'
            title={''}
          >
            {getValues(`${props.inputName}.is_free_of_charge`) ? (
              <div className='flex items-center gap-2'>
                <p className={`${props.currency === 'GEL' ? 'pt-1' : ''} w-1`}>
                  {' '}
                  {getCurrencySymbol(props.currency)}
                </p>
                0
                <div className='flex items-center text-[#DC2626] gap-0.5 text-2xs relative'>
                  <div
                    className={`${
                      props.currency === 'GEL' ? 'top-3' : 'top-[0.61rem]'
                    } w-full bg-[#DC2626] h-[0.8px] absolute z-999 `}
                  />

                  <p className=''> {getCurrencySymbol(props.currency)}</p>
                  {convertNumbersAsPrice(getValues(`${props.inputName}.budget`) ?? 0)}
                </div>
              </div>
            ) : (
              <>
                <p className='w-4'> {getCurrencySymbol(props.currency)}</p>
                {convertNumbersAsPrice(getValues(`${props.inputName}.budget`) ?? 0)}
              </>
            )}
          </div>
        )}
        <div
          className={`${
            props.phaseType === 'monthly' && props.isProjectInternal
              ? 'col-span-11'
              : props.phaseType !== 'monthly' && props.isProjectInternal
              ? 'col-span-10'
              : props.phaseType === 'monthly'
              ? 'col-span-5'
              : 'col-span-4'
          } flex relative text-md items-center`}
          title={''}
        >
          <div
            className={`${
              getErrorMessage(formState.errors, `${props.inputName}.employee_id`) &&
              'border! border-red-500!  outline-0'
            } flex items-center text-left text-sm! text-zinc-700 hover:bg-gray-100 w-full`}
          >
            <AdvancedSelect
              inputName={`${props.inputName}.employee_id`}
              list={list as StaffMinimalEmployee[]}
              placeholder=''
              className='w-full!'
              externalButtonTextRenderer={(value) => {
                let currentUSer = props.minimalUsers?.find(
                  (user) => user.id == getValues(`${props.inputName}.employee_id`),
                );

                return renderEmployeeWithImage(
                  value as number | string,
                  '',
                  props.minimalUsers ?? [],
                  { getValues, setValue },
                  `${props.inputName}.employee_id`,
                  currentUSer as unknown as AuthUser,
                  !!getErrorMessage(formState.errors, `${props.inputName}.employee_id`),
                  props.isReadOnly,
                  'w-5! h-5!',
                  'bg-white rounded-full',
                  '',
                  props.updateOnBlurHandler!,
                );
              }}
              externalButtonClassName={`${
                getValues(`${props.inputName}.employee_id`)
                  ? 'top-2!'
                  : '!placeholder:text-zinc-400 text-zinc-400! top-2!'
              } left-4!`}
              inputClassName='border-none! outline-hidden! truncate pl-4!  w-full! focus:border-transparent focus:ring-indigo-600 rounded-none! focus:ring-1 bg-transparent! pt-2! placeholder:text-zinc-700'
              customButtonStyles={{
                width: '93%',
              }}
              errorIconStyles='top-2!'
              externalOptionTextRenderer={(value: any) =>
                employeesListWithSkillsOptionRenderer(value)
              }
              dropDownStyles='w-140! top-9! right-0! px-0! gap-0! py-0! max-h-72!'
              disableArrowIcon
              showErrorMessageDialog
              removeErrorMessage
              externalOnListItemClickHandler={() => {
                props.updateOnBlurHandler();
                analytics.track('Phase role staffing');
              }}
              doNotRenderList={getValues(`${props.currentPhaseName}`)?.map((el: Staff) =>
                el.employee_id?.toString(),
              )}
              canNotEdit={props.isReadOnly}
              listItemStyles={`py-[0.906rem]! px-3`}
              listHeaders={
                <a
                  href={'/traffic?table=people'}
                  target='_blank'
                  className='text-2xs gap-1.5 hover:opacity-75 h-9 py-[0.688rem] text-zinc-400 flex items-center justify-end sticky top-0 px-2 bg-white border-b'
                >
                  Traffic table <NewTab color='#9DA1A9' size='14' />
                </a>
              }
              resetLists
            />
          </div>
        </div>
      </li>
    </>
  );
};

export default PhaseTableRow;
