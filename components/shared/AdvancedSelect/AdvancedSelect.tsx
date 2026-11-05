import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useAdvancedSelect } from './useAdvancedSelect';
import { ErrorMessage } from '@hookform/error-message';
import { capitalizeErrorMessage, getErrorMessage } from 'helpers';
import {
  DownChevron,
  ExclamationCircle,
  BlueExclamationCircle,
  InformationHover,
} from 'components';
import { cn } from 'lib';

const AdvancedSelect: React.FC<Props> = (props) => {
  const {
    list,
    errors,
    dropdownToggler,
    searchInDropdownHandler,
    setValue,
    getValues,
    buttonRef,
    dropdownRef,
    searchRef,
    isOpen,
    setIsOpen,
    register,
    clearErrors,
    setList,
    customButtonOndEditMode,
    toggleCustomButton,
    setCustomButtonOnEditMode,
    errorMessage,
    isErrorIconHovered,
    setIsErrorIconHovered,
    dropDownChevron,
  } = useAdvancedSelect(
    props.list,
    props.inputName,
    props.noSearch,
    props.externalSearchHandler,
    props.initialList,
    props.firstRowIsDesc,
    props.searchOnChange,
    props.resetLists,
    props.isIdString,
  );

  const inputTitle = (props.list as { id: number; title: string }[])?.find(
    (el: any) => el.id == getValues(props.inputName),
  )?.title;

  const finalOptionsList = (list as { id: number; title: string }[]).filter(
    (item) =>
      (item.id && !(props.doNotRenderList as string[])?.includes(item.id?.toString())) || !item.id,
  );

  return (
    <div
      className={twMerge(
        'relative flex flex-col justify-center ',
        !props.canNotEdit && 'cursor-pointer',
        props.className,
      )}
      style={
        !!props.calculateWidth
          ? getValues(props.inputName)
            ? {
                width: `${
                  inputTitle?.length! * 16 * 0.8 + 15 > 70
                    ? inputTitle?.length! * 16 * 0.8 + 15
                    : 80
                }px`,
              }
            : { width: `${props.calculateWidth}px` }
          : undefined
      }
      onClick={() =>
        !props.canNotEdit && props.noSearch && props.openDropdownOnWrapperClick && dropdownToggler()
      }
    >
      <div className='flex flex-col h-full items-start' ref={buttonRef}>
        <div className='flex items-center gap-2'>
          {props.labelName && (
            <label
              className={`${props.labelClassName} mb-1 leading-[1.375rem] block text-sm font-medium text-zinc-700`}
            >
              {props.labelName}
            </label>
          )}
          {!!props.infoText && (
            <div className='group relative'>
              <BlueExclamationCircle
                width='14'
                height='14'
                className='cursor-pointer -translate-y-[0.2rem]'
              />
              <div className='hidden relative group-hover:flex'>
                <div
                  className={twMerge(
                    `flex flex-col absolute -inset-5 -top-27 text-xs leading-2 gap-2 transition-all z-10
                     bg-white border border-gray-100 rounded-md p-3 text-gray-700 left-1/2 -translate-x-1/2 shadow-xs w-72 h-20`,
                  )}
                >
                  {props.infoText}
                </div>
                <div className='w-5 h-5 absolute -top-10 bg-white z-20 border border-t-0 border-l-0 border-gray-100 rounded-br-md rotate-45 -bottom-7 left-1/2 -translate-x-1/2 shadow-xs' />
              </div>
            </div>
          )}
        </div>
        {props.loading ? (
          <div
            className={twMerge(
              'h-12 w-full animate-pulse rounded-md bg-gray-300',
              props.loaderStyles,
            )}
          />
        ) : (
          <>
            <div className='relative w-full h-full'>
              <div
                onClick={() => !props.canNotEdit && toggleCustomButton()}
                className={` ${
                  customButtonOndEditMode || !props.externalButtonTextRenderer ? 'hidden' : ''
                } ${props.externalButtonClassName} ${
                  props.canNotEdit ? 'cursor-default' : 'cursor-pointer'
                } absolute -top-5 z-10 `}
                style={props.customButtonStyles}
              >
                {props.externalButtonTextRenderer?.(getValues(props.inputName))}
              </div>
              {props.noSearch ? (
                <>
                  <input
                    className={twMerge(
                      'w-full rounded-md px-4 h-10 py-[9px]  text-zinc-700 capitalize border  border-zinc-200 placeholder:text-zinc-400 text-base bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500 focus:ring-indigo-600',
                      props.inputClassName,
                      !props.canNotEdit && 'cursor-pointer',
                      !props.canNotEdit &&
                        !props.externalButtonTextRenderer &&
                        'transition-150-ease-in hover:bg-gray-300',
                      props.isTableCell && 'bg-white',
                      props.externalButtonTextRenderer && !customButtonOndEditMode && 'opacity-0',
                      getErrorMessage(errors, props.inputName) && 'border-red-500!  outline-0',
                    )}
                    onClick={(e) => (props.noSearch ? dropdownToggler(e) : toggleCustomButton())}
                    autoComplete='off'
                    placeholder={props.placeholder}
                    disabled={props.canNotEdit}
                    readOnly
                    value={
                      props.useOriginalValue
                        ? (((list as { id: number; title: string }[])?.find(
                            (item) => item.id == +getValues(props.inputName),
                          )?.title ??
                            props.defaultValue ??
                            '') as string)
                        : ((props.externalOptionTextRenderer?.(getValues(props.inputName)) ??
                            (list as { id: number; title: string }[])?.find(
                              (item) => item.id == +getValues(props.inputName),
                            )?.title ??
                            props.defaultValue ??
                            '') as string)
                    }
                    onFocus={(e) => {
                      !props.removeChangeOnFocus &&
                        props.onChangeHandler?.({ id: +e.target?.value });
                      props.externalOnFocusHandler?.(setList);
                    }}
                    ref={searchRef}
                    style={props.inputStyles}
                  />

                  <input
                    hidden
                    {...register(props.inputName, props.registerOptions)}
                    onChange={(e) => props.onChangeHandler?.({ id: +e.target?.value })}
                  />
                  {!props.disableArrowIcon && !props.canNotEdit && (
                    <DownChevron
                      className={twMerge(
                        'absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none',
                        isOpen && !props.doNotRotateChevronIcon && 'rotate-180 transition-all',
                        props.chevronStyles,
                      )}
                    />
                  )}
                  {props.informationText && props.canNotEdit && (
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 z-99'>
                      <InformationHover
                        text={props.informationText}
                        extraHoverClasses='top-1 -right-2.5'
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type='text'
                    onClick={() => (props.noSearch ? dropdownToggler() : toggleCustomButton())}
                    onChange={(e) => {
                      !props.isBackendSearch && searchInDropdownHandler(e.currentTarget.value);
                      props.onChangeHandler?.({ id: e.target?.value });
                    }}
                    className={twMerge(
                      'w-full rounded-md  px-4 h-10 py-[9px] z-30 text-zinc-700 cursor-pointer opacity-100 capitalize border-zinc-200 focus:border-none placeholder:text-zinc-400 text-base bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500 focus:ring-indigo-600!',
                      props.noSearch && 'hidden',
                      props.isTableCell && 'bg-white',
                      !props.canNotEdit &&
                        !props.externalButtonTextRenderer &&
                        'transition-150-ease-in hover:bg-gray-300!',
                      props.inputClassName,
                      !props.canNotEdit && 'cursor-pointer',
                      props.externalButtonTextRenderer && !customButtonOndEditMode && 'opacity-0',
                      getErrorMessage(errors, props.inputName) && 'border-red-500!  outline-0',
                    )}
                    autoComplete='off'
                    disabled={props.canNotEdit}
                    readOnly={props.canNotEdit}
                    ref={searchRef}
                    defaultValue={
                      !props.externalButtonTextRenderer
                        ? props.renderDefaultValue?.(getValues(props.inputName)) ??
                          (list as { id: number; title: string }[]).find(
                            (item) => item.id === getValues(props.inputName),
                          )?.title ??
                          props.defaultValue
                        : undefined
                    }
                    placeholder={props.placeholder}
                    name={props.inputName}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.value === '') setValue(props.inputName, '');
                    }}
                    style={props.inputStyles}
                    onBlur={props.onBlurHandler}
                    onKeyDown={(e) =>
                      props.onKeyDownHandler?.(e.key, setIsOpen, searchRef?.current?.value ?? '')
                    }
                  />
                  <input
                    defaultValue={getValues(props.inputName) ?? props.defaultValue}
                    hidden
                    {...register(props.inputName, props.registerOptions)}
                    onChange={(e) => props.onChangeHandler?.({ id: +e.target?.value })}
                  />
                  {!props.disableArrowIcon && !props.canNotEdit && (
                    <button
                      onClick={() => dropDownChevron()}
                      className={`${props.chevronStyles} absolute top-1/2 -translate-y-1/2 right-4`}
                      type='button'
                    >
                      <DownChevron
                        className={twMerge(
                          isOpen && !props.doNotRotateChevronIcon && 'rotate-180 transition-all',
                        )}
                      />
                    </button>
                  )}
                  {props.informationText && props.canNotEdit && (
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 z-99'>
                      <InformationHover
                        text={props.informationText}
                        extraHoverClasses='top-1 -right-2.5'
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
      {isOpen && (
        <>
          <ul
            className={twMerge(
              props.dropDownStyles?.includes('right') ? '' : 'left-0',
              'flex flex-col  gap-2 absolute top-16 overflow-auto  w-full max-h-48 mt-1 bg-white overflow-x-clip shadow-xs z-9999! border border-neutral-100 px-2! rounded-md',
              props.dropDownStyles,
              props.searchOnChange ? '' : 'py-2',
            )}
            ref={dropdownRef}
          >
            {props.listHeaders}
            {finalOptionsList.length ? (
              finalOptionsList?.map((item, i) => (
                <li
                  className={cn(
                    'p-2 flex items-start rounded-md capitalize text-sm break-all',
                    (props.firstRowIsDesc && i === 0) || !item?.id
                      ? 'text-zinc-400! text-2xs'
                      : 'hover:bg-[#F3F4F6] cursor-pointer',
                    props.listItemStyles && item.id && 'border-b border-gray-100',
                    props.listItemStyles,
                  )}
                  key={item.id}
                  onClick={() => {
                    if ((props.firstRowIsDesc && i !== 0) || !props.firstRowIsDesc) {
                      if (item.id) {
                        searchRef.current!.value =
                          props.externalOptionTextOnChange?.(item as { title: string; id: number })
                            ?.title ?? item.title!;

                        props.externalButtonTextRenderer?.(item.id);

                        setCustomButtonOnEditMode(false);
                        setValue(props.inputName, item.id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        props.externalOnListItemClickHandler?.(item.id);
                        clearErrors(props.inputName);
                        !props.isBackendSearch && props.onChangeHandler?.(item);
                        props.openDropdownOnWrapperClick ? setIsOpen(true) : setIsOpen(false);
                      } else {
                        setValue(props.inputName, '', { shouldDirty: true });

                        props.openDropdownOnWrapperClick ? setIsOpen(true) : setIsOpen(false);
                      }
                    }
                  }}
                  title={item.title}
                >
                  {props.externalOptionTextRenderer?.(item as { id: number; title: string }) ??
                    item?.title}
                </li>
              ))
            ) : (
              <p className='text-xs text-zinc-300 w-full'>{props.emptyStateText ?? ''}</p>
            )}
            {props.searchOnChange && searchRef?.current?.value && !finalOptionsList?.length && (
              <div className='text-xs text-[#5A636F] sticky bottom-0  -mx-2 py-3 px-4 bg-white border rounded-b-md'>
                create new{' '}
                {searchRef?.current?.value && (
                  <span
                    onClick={() => {
                      setValue(props.inputName, { id: null, title: searchRef?.current?.value });
                      props.searchOnChangeExternal?.(searchRef?.current?.value!);
                      setIsOpen(false);
                    }}
                    className='text-xs cursor-pointer text-indigo-600 rounded-[1px] px-1 py-[2px] bg-indigo-50'
                  >
                    {searchRef?.current?.value}
                  </span>
                )}
              </div>
            )}
          </ul>
        </>
      )}

      {!props.disableErrorIcon &&
        typeof getErrorMessage(errors, props.inputName) === 'string' &&
        !props.canNotEdit && (
          <div
            className={`${props.errorIconStyles} absolute top-9 right-3 flex h-fit items-center pl-4 bg-transparent z-99999999`}
            onMouseEnter={() => setIsErrorIconHovered(true)}
            onMouseLeave={() => setIsErrorIconHovered(false)}
          >
            <ExclamationCircle />
            {isErrorIconHovered && props.showErrorMessageDialog && (
              <div className='relative'>
                <div
                  className={twMerge(
                    `absolute -top-8 right-0  w-[340px]`,
                    props.errorMessageDialogClass,
                  )}
                >
                  <p className='text-white text-xs font-medium px-2 py-1 w-full rounded-[36px] bg-zinc-700'>
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      {!props.isTableCell && !props.removeErrorMessage && (
        <div
          className={twMerge(
            `text-left  text-red-500 text-2xs! ${
              !props.doNotLeavePlaceForError && 'h-4 mt-1 min-h-5'
            }`,
            props.errorStyles,
          )}
        >
          {!props.canNotEdit && (
            <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSelect;
