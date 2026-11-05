import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useBasicSelect } from './useBasicSelect';
import { ErrorMessage } from '@hookform/error-message';
import { capitalizeErrorMessage, getErrorMessage } from 'helpers';
import { DownChevron, ExclamationCircle, InformationHover } from 'components';

const BasicSelect: React.FC<Props> = (props) => {
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
    toggleCustomButton,
    customButtonOndEditMode,
    setCustomButtonOnEditMode,
    errorMessage,
    isErrorIconHovered,
    setIsErrorIconHovered,
  } = useBasicSelect(
    props.list,
    props.inputName,
    props.onChangeHandler,
    props.noSearch,
    props.externalSearchHandler,
    props.isBackendSearch,
  );

  return (
    <div className={twMerge('relative w-full flex flex-col justify-center', props.className)}>
      <div className='flex flex-col items-start h-full' ref={buttonRef}>
        {props.labelName && (
          <label
            className={`${props.labelClassName} mb-1 leading-[1.375rem] block text-sm font-medium text-zinc-700`}
          >
            {props.labelName}
          </label>
        )}
        {props.loading ? (
          <div
            className={twMerge('h-12 animate-pulse rounded-md bg-gray-300', props.loaderStyles)}
          />
        ) : (
          <>
            <div className='relative w-full'>
              <div
                onClick={() => !props.canNotEdit && toggleCustomButton()}
                className={` ${
                  !customButtonOndEditMode && !props.externalButtonTextRenderer ? 'hidden' : ''
                } ${
                  props.externalButtonClassName
                } absolute hover:opacity-80 -top-5 z-10 cursor-pointer`}
              >
                {props.externalButtonTextRenderer?.(getValues(props.inputName))}
              </div>
              {props.noSearch ? (
                <>
                  <input
                    className={twMerge(
                      'w-full rounded-md px-4 py-[9px] text-zinc-700 border opacity-100  border-zinc-200 focus:border-indigo-600 placeholder:text-zinc-400 text-base bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-hidden focus:border',
                      !props.canNotEdit && 'cursor-pointer',
                      props.isTableCell && 'bg-white',
                      props.inputClassName,
                      !props.canNotEdit &&
                        !props.externalButtonTextRenderer &&
                        'transition-150-ease-in hover:bg-gray-300!',
                      props.externalButtonTextRenderer && 'opacity-0',
                      getErrorMessage(errors, props.inputName) && 'border-red-500!  outline-0',
                    )}
                    onClick={() => (props.noSearch ? dropdownToggler() : toggleCustomButton())}
                    autoComplete='off'
                    placeholder={props.placeholder}
                    disabled={props.canNotEdit}
                    readOnly
                    value={
                      props.useOriginalValue
                        ? getValues(props.inputName) ?? props.defaultValue ?? ''
                        : props.externalOptionTextRenderer?.(getValues(props.inputName)) ??
                          getValues(props.inputName) ??
                          props.defaultValue ??
                          ''
                    }
                    onFocus={(e) => {
                      !props.removeChangeOnFocus && props.onChangeHandler?.(e.target?.value);
                      props.externalOnFocusHandler?.(setList);
                    }}
                    ref={searchRef}
                  />
                  <input
                    hidden
                    {...register(props.inputName, props.registerOptions)}
                    onChange={(e) => props.onChangeHandler?.(e.target?.value)}
                  />
                  {!props.disableArrowIcon && !props.canNotEdit && (
                    <DownChevron
                      className={twMerge(
                        'absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none transition-all',
                        isOpen && !props.doNotRotateChevronIcon && 'rotate-180',
                        props.chevronStyles,
                      )}
                    />
                  )}
                  {props.informationText && props.canNotEdit && (
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
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
                    className={twMerge(
                      'w-full rounded-md px-4 capitalize py-[9px] disabled:hover:opacity-100 text-zinc-700 opacity-100 cursor-pointer  border-zinc-200 focus:border-none focus:ring-indigo-600 placeholder:text-zinc-400 text-base bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500',
                      props.noSearch && 'hidden',
                      props.isTableCell && 'bg-white',
                      props.inputClassName,
                      !props.canNotEdit && 'cursor-pointer',
                      !props.canNotEdit &&
                        !props.externalButtonTextRenderer &&
                        'transition-150-ease-in hover:bg-gray-300!',
                      props.externalButtonTextRenderer && !customButtonOndEditMode && 'opacity-0',
                      getErrorMessage(errors, props.inputName) && 'border-red-500!  outline-0',
                    )}
                    autoComplete='off'
                    disabled={props.canNotEdit}
                    readOnly={props.canNotEdit}
                    ref={searchRef}
                    onClick={() => (props.noSearch ? dropdownToggler() : toggleCustomButton())}
                    defaultValue={
                      props.renderDefaultValue?.(getValues(props.inputName)) ??
                      getValues(props.inputName) ??
                      props.defaultValue
                    }
                    placeholder={props.placeholder}
                    onFocus={(e) => {
                      props.isBackendSearch && searchInDropdownHandler(searchRef.current!.value, e);
                    }}
                    name={props.inputName}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.value === '') setValue(props.inputName, '');
                    }}
                    onChange={(e) => {
                      setIsOpen(true);
                      !props.isBackendSearch && searchInDropdownHandler(e.currentTarget.value, e);
                      props.onChangeHandler?.(e.target?.value);
                    }}
                  />
                  <input
                    defaultValue={getValues(props.inputName) ?? props.defaultValue}
                    hidden
                    {...register(props.inputName, props.registerOptions)}
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
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                      <InformationHover
                        text={props.informationText}
                        extraHoverClasses='top-1 -right-3'
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
        <ul
          className={twMerge(
            list.length ? 'opacity-100' : 'opacity-0',
            'flex flex-col gap-2 absolute top-16 overflow-auto left-0 w-full max-h-48 py-2 mt-1 bg-white overflow-x-clip shadow-xs z-9999! border border-neutral-100 px-2! rounded-md',
            props.dropDownStyles,
          )}
          ref={dropdownRef}
        >
          {list
            .filter((item) => !props.doNotRenderList?.includes(item))
            .map((item) => (
              <li
                className={`${props.dropDownItemStyles} p-2 hover:bg-[#F3F4F6] flex  capitalize items-start rounded-md cursor-pointer text-sm break-all`}
                key={item}
                onClick={() => {
                  searchRef.current!.value = props.externalOptionTextOnChange?.(item) ?? item;
                  props.externalButtonTextRenderer?.(item);
                  setCustomButtonOnEditMode(false);
                  setValue(props.inputName, item, { shouldValidate: true, shouldDirty: true });
                  clearErrors(props.inputName);
                  !props.isBackendSearch && props.onChangeHandler?.(item);
                  setIsOpen(false);
                  props.externalOnListItemClickHandler?.(item);
                }}
                title={item}
              >
                {props.externalOptionTextRenderer?.(item) ?? item}
              </li>
            ))}
        </ul>
      )}
      {!props.disableErrorIcon &&
        typeof getErrorMessage(errors, props.inputName) === 'string' &&
        !props.canNotEdit && (
          <div
            className={`${props.errorIconStyles} absolute top-9 right-3 flex h-fit items-center pl-4 bg-transparent`}
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
            `text-left text-red-500 text-2xs! ${
              !props.doNotLeavePlaceForError ? 'h-4 mt-1 min-h-5' : ''
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

export default BasicSelect;
