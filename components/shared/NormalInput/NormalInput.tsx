import { Props } from './types';
import {
  capitalizeErrorMessage,
  convertTolocaleDate,
  getErrorMessage,
  reconcileDate,
} from 'helpers';
import {
  CalendarIcon,
  CustomDateHeader,
  ExclamationCircle,
  InformationHover,
  ShowHide,
} from 'components';
import { ErrorMessage } from '@hookform/error-message';
import { useNormalInput } from './useNormalInput';
import DatePicker from 'react-datepicker';
import { twMerge } from 'tailwind-merge';
import BlueExclamationCircle from 'components/icons/BlueExclamationCircle';

const NormalInput: React.FC<Props> = ({ nativeDateInput = false, ...props }) => {
  const {
    ref,
    errors,
    inputRef,
    setValue,
    isVisible,
    getValues,
    inputValue,
    setIsVisible,
    holidayDates,
    registerValues,
    openDatePicker,
    datePickerRef,
  } = useNormalInput(
    props.inputName,
    props.registerOptions,
    props.externalOnChange,
    props.type,
    props.doNotExcludeHolidays,
  );

  return (
    <label
      className={`${props.containerClasses} ${props.isTableCell ? '' : 'h-full w-full'}`}
      onClick={(e) => {
        props.externalOnContainerClick?.();
        props.type === 'date' && !nativeDateInput && e.preventDefault();
      }}
    >
      {!props.noLabel && (
        <div className='flex items-center gap-2'>
          {props.labelName && (
            <span
              className={`mb-1 block text-sm leading-[1.375rem] font-medium text-slate-900 ${props.labelClasses}`}
            >
              {props.labelName}
            </span>
          )}
          {!!props.infoText && (
            <div className='group relative inline-flex -translate-y-[0.2rem]'>
              <BlueExclamationCircle width='14' height='14' className='cursor-pointer' />
              <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 hidden -translate-x-1/2 group-hover:flex'>
                <div
                  className={twMerge(
                    `flex w-60 flex-col gap-2 rounded-md border border-gray-100 bg-white p-3 text-xs text-gray-700 shadow-xs`,
                  )}
                >
                  {props.infoText}
                </div>
                <div className='absolute -bottom-2 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rotate-45 rounded-br-md border border-t-0 border-l-0 border-gray-100 bg-white shadow-xs' />
              </div>
            </div>
          )}
        </div>
      )}
      {props.loading ? (
        <div className={`h-12 animate-pulse rounded-md bg-gray-300 ${props.extraLoaderClasses}`} />
      ) : (
        <div className={`relative w-full ${props.inputParentDivClasses}`}>
          {props.type === 'date' && !nativeDateInput && (
            <div
              className={`${
                !props.canNotEdit ? '' : 'bg-transparent'
              } z-50 single-date-picker single w-full`}
            >
              <DatePicker
                ref={datePickerRef}
                selected={inputValue ? reconcileDate(inputValue) : null}
                filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
                excludeDates={[...(props.excludeDates ?? []), ...holidayDates]}
                placeholderText={props.placeholderText ?? 'dd/mm/yyyy'}
                strictParsing
                customInput={
                  <input
                    disabled
                    className={`${
                      props.className
                    } w-full text-base border bg-gray-50 border-zinc-200 hover:cursor-pointer focus:border-indigo-600 focus:outline-hidden focus:ring-indigo-600  focus:cursor-text ${
                      typeof getErrorMessage(errors, props.inputName) === 'string' &&
                      !props.canNotEdit &&
                      'ring-red-500 focus:ring-1'
                    }  ${
                      props.disabledClasses ?? 'disabled:bg-gray-50 disabled:text-gray-500'
                    } rounded-md px-4 pl-10 py-[9px] placeholder:text-zinc-400 text-slate-900`}
                  />
                }
                onChange={(newDate) => {
                  setValue(props.inputName, newDate ? convertTolocaleDate(newDate) : null, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  props.OnDateChange?.(newDate);
                }}
                disabled={props.canNotEdit}
                onKeyDown={props.externalKeyDown}
                onCalendarClose={props.blurHandler}
                dateFormat='dd/MM/yyyy'
                calendarStartDay={1}
                formatWeekDay={(dayName) => dayName[0]}
                minDate={props.minDate}
                maxDate={props.maxDate}
                renderCustomHeader={({
                  date,
                  increaseYear,
                  decreaseYear,
                  decreaseMonth,
                  increaseMonth,
                }) => (
                  <CustomDateHeader
                    date={date}
                    decreaseMonth={decreaseMonth}
                    increaseMonth={increaseMonth}
                    decreaseYear={decreaseYear}
                    increaseYear={increaseYear}
                  />
                )}
              />
              {!props.hideDate && (
                <CalendarIcon
                  className={twMerge(
                    'absolute top-3 left-3',
                    props.openDatePickerOnCalendarClick && 'cursor-pointer',
                    props.calendarIconStyles,
                  )}
                  onClick={() => props.openDatePickerOnCalendarClick && openDatePicker()}
                />
              )}
            </div>
          )}
          <input
            className={twMerge(
              'w-full  border-zinc-200 rounded-md px-4 py-[9px] h-10 bg-gray-50 placeholder:text-zinc-400 text-sm text-slate-900 focus:outline-1 focus:outline-solid focus:ring-indigo-600 focus:border-transparent',
              !nativeDateInput &&
                props.type === 'date' &&
                '-indent-4000! opacity-0! pointer-events-none! h-0! p-0!',
              typeof getErrorMessage(errors, props.inputName) === 'string' &&
                !props.canNotEdit &&
                'border-transparent outline-1 outline-solid ring-red-500 outline-red-500 focus:ring-red-500',
              props.disabledClasses ?? 'disabled:bg-gray-50 disabled:text-gray-500',
              props.isTableCell && 'bg-white',
              props.className,
            )}
            type={!props.type || (props.type === 'password' && isVisible) ? 'text' : props.type}
            defaultValue={props.defaultValue || getValues(props.inputName)}
            min={props.numberMin || props.min}
            max={props.numberMax || props.max}
            id={props.inputName}
            readOnly={props.readOnly}
            autoComplete={props.autoComplete}
            {...registerValues}
            ref={(e) => {
              ref(e);
              inputRef.current = e;
              if (props.externalRef) {
                props.externalRef.current = e;
              }
            }}
            placeholder={props.placeholder}
            onKeyDown={props.externalKeyDown}
            onWheel={(e) => {
              if (props.type !== 'number') return;
              e.currentTarget.blur();
            }}
            onBlur={props.blurHandler}
            disabled={props.canNotEdit}
            tabIndex={!nativeDateInput && props.type === 'date' ? -1 : 0}
            step={props.step ?? 'any'}
            size={props.size}
            autoFocus={props.autoFocus}
          />
          {props.type === 'password' &&
          !(typeof getErrorMessage(errors, props.inputName) === 'string') ? (
            <ShowHide
              show={isVisible}
              onClick={() => setIsVisible((prev) => !prev)}
              className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2'
            />
          ) : null}
          {props.renderExternalElement}
          {((typeof getErrorMessage(errors, props.inputName) === 'string' && !props.canNotEdit) ||
            props.manualError) && (
            <div
              className={`${
                props.type === 'date' ? '-mt-6' : ''
              } pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 z-100`}
            >
              <div
                className={`${props.errorIconStyles} relative flex h-fit items-center pl-4 bg-transparent`}
              >
                {props.errorOnHover && (
                  <div className='absolute top-0 flex items-center pr-2 z-999999999'>
                    <InformationHover
                      text={getErrorMessage(errors, props.inputName)}
                      iconClassName='opacity-0'
                      extraHoverClasses='top-0!'
                    />
                  </div>
                )}
                <ExclamationCircle />
              </div>
            </div>
          )}
          {props.informationText && props.canNotEdit && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <InformationHover text={props.informationText} />
            </div>
          )}
        </div>
      )}
      {!props.isTableCell && (
        <div
          className={`text-left text-red-500 text-2xs mt-1 ${
            props.type === 'date' ? '-mt-5!' : ''
          } ${!props.doNotLeavePlaceForError && 'mt-1 min-h-5'} ${props.errorBaseHeight}`}
        >
          {!props.canNotEdit && (
            <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
          )}
        </div>
      )}
    </label>
  );
};

export default NormalInput;
