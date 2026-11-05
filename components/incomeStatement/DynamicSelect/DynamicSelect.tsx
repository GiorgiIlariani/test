import { Props } from './types';
import { DynamicSelectListItem, PortalWrapper } from 'components';
import { useDynamicSelect } from './useDynamicSelect';

const DynamicSelect: React.FC<Props> = (props) => {
  const {
    createItemHandler,
    selectItemHandler,
    triggerRef,
    listIsOpen,
    toggleNameButton,
    dropDownRef,
    isDisabled,
    height,
    handleMouseMove,
    setListIsOpen,
    leftPosition,
    width,
    firstNameRef,
    registerWithOnChange,
    ref,
    reAddDeletedItem,
    getValues,
    chooseListItemOnEnter,
    isServiceHovered,
    setIsServiceHovered,
    resetServiceInput,
  } = useDynamicSelect(
    props.inputName,
    props.list,
    props.setList,
    props.initialList,
    props.setInitialList,
    props.inputType,
    props.canCreateListItem!,
    props.otherExpenseTitles,
    props.isNumberAdded,
    props.isOtherAdmin,
    props.initialDepartmentList,
    props.setDepartmentList,
  );

  return (
    <div
      className={`w-full ${props.className} pl-16`}
      onMouseLeave={() => listIsOpen && setListIsOpen(false)}
    >
      <div className='flex flex-col gap-1 relative'>
        <div className='flex flex-col gap-1 items-center'>
          <div
            id='dynamic-input'
            className='relative w-full'
            onClick={() => {
              if (!isDisabled && !props.isDisabled) {
                toggleNameButton();
                handleMouseMove();
              }
            }}
            ref={triggerRef}
            onKeyDown={(e) => e.key === 'Backspace' && reAddDeletedItem()}
            onMouseOver={() =>
              getValues(`${props.inputName}.name`).length > 50 &&
              props.inputType !== 'department' &&
              setIsServiceHovered(true)
            }
            onMouseLeave={() => setIsServiceHovered(false)}
          >
            <input
              type='search'
              className={`${props.inputClass} outline-hidden capitalize border-none pl-0 border-transparent focus:border-transparent focus:ring-0 text-sm w-full placeholder:text-zinc-400 placeholder:text-xs z-30`}
              {...registerWithOnChange}
              ref={(e) => {
                ref(e);
                firstNameRef.current = e;
              }}
              placeholder={props.inputType}
              disabled={isDisabled || props.isDisabled}
              onClick={() => triggerRef.current?.click()}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                chooseListItemOnEnter({ title: getValues(`${props.inputName}.name`), id: null })
              }
            />
          </div>
          {isServiceHovered && (
            <div
              className={`top-9 absolute border rounded-lg left-0 bg-gray-200 px-3 py-1 z-50 text-xs`}
            >
              {getValues(`${props.inputName}.name`)}
            </div>
          )}

          {listIsOpen && (
            <PortalWrapper>
              <div
                ref={dropDownRef}
                className={`shadow-md bg-white fixed z-9999999 border rounded-md overflow-x-clip overflow-y-auto max-h-36`}
                style={{
                  top: height,
                  left: leftPosition,
                  width: width,
                }}
              >
                <ul className='flex flex-col  z-30  py-1 px-2  text-sm'>
                  {(props.inputType === 'department' ? props.departmentList : props.list)?.map(
                    (item, i) => (
                      <DynamicSelectListItem
                        item={item}
                        canCreateListItem={props.canCreateListItem!}
                        createItemHandler={createItemHandler}
                        selectItemHandler={selectItemHandler}
                        i={i}
                        key={i}
                        resetServiceInput={resetServiceInput}
                        inputType={props.inputType}
                      />
                    ),
                  )}
                </ul>
              </div>
            </PortalWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicSelect;
